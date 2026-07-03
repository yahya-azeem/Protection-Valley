variable "gcp_project_id" {
  type        = string
  description = "The GCP Project ID where resources will be created"
}

variable "gcp_region" {
  type        = string
  default     = "us-central1"
  description = "The GCP region to deploy resources"
}

variable "database_password" {
  type        = string
  sensitive   = true
  description = "The password for the MariaDB database user"
}

variable "erpnext_admin_password" {
  type        = string
  sensitive   = true
  description = "The Administrator password for ERPNext"
}
