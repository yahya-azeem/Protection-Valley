provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# 1. VPC Network
resource "google_compute_network" "default" {
  name                    = "erpnext-network"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "default" {
  name          = "erpnext-subnet"
  ip_cidr_range = "10.0.0.0/24"
  network       = google_compute_network.default.id
}

# 2. Serverless VPC Access Connector
resource "google_vpc_access_connector" "connector" {
  name          = "erpnext-vpc-conn"
  region        = var.gcp_region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.default.name
}

# 3. Memorystore Redis Instance
resource "google_redis_instance" "cache" {
  name               = "erpnext-redis"
  tier               = "BASIC"
  memory_size_gb     = 1
  authorized_network = google_compute_network.default.id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"
  redis_version      = "REDIS_6_X"
  region             = var.gcp_region
}

# 4. Managed Cloud SQL (MariaDB)
resource "google_sql_database_instance" "mariadb" {
  name             = "erpnext-db"
  database_version = "MARIADB_10_6"
  region           = var.gcp_region

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled    = true
      private_network = google_compute_network.default.id
    }
  }
}

resource "google_sql_database" "db" {
  name     = "erpnext"
  instance = google_sql_database_instance.mariadb.name
}

resource "google_sql_user" "user" {
  name     = "root"
  instance = google_sql_database_instance.mariadb.name
  password = var.database_password
}

# 5. Cloud Run Service for ERPNext
resource "google_cloud_run_service" "erpnext" {
  name     = "erpnext-web"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = "gcr.io/${var.gcp_project_id}/erpnext:latest"
        
        ports {
          container_port = 8080
        }

        env {
          name  = "DB_HOST"
          value = google_sql_database_instance.mariadb.private_ip_address
        }
        env {
          name  = "DB_NAME"
          value = google_sql_database.db.name
        }
        env {
          name  = "REDIS_CACHE_URL"
          value = "redis://${google_redis_instance.cache.host}:${google_redis_instance.cache.port}"
        }
        env {
          name  = "ADMIN_PASSWORD"
          value = var.erpnext_admin_password
        }
      }
    }

    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow private access to Cloud Run (only accessible via reverse proxy)
resource "google_cloud_run_service_iam_member" "noauth" {
  location = google_cloud_run_service.erpnext.location
  project  = google_cloud_run_service.erpnext.project
  service  = google_cloud_run_service.erpnext.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "erpnext_url" {
  value       = google_cloud_run_service.erpnext.status[0].url
  description = "The URL of the private Cloud Run ERPNext deployment"
}
