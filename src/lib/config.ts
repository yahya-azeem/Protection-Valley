export const DESIGN_TOKENS = {
  colors: {
    background: '#000000', // OLED Black
    surface: '#0A0A0A',
    primary: '#FF8800',    // Vibrant Orange (Klein Style)
    secondary: '#0066CC',  // Klein Blue for SKUs
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      accent: '#FF8800'
    },
    border: '#1F1F1F'
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    headingFont: '"Outfit", sans-serif'
  },
  spacing: {
    container: '1280px',
    gutter: '1.5rem'
  }
};

export const API_CONFIG = {
  baseUrl: '/api/v1',
  endpoints: {
    products: '/products',
    login: '/auth/login',
    google_login: '/auth/google/login',
    register: '/auth/register',
    me: '/auth/me',
    create_checkout_session: '/checkout/create-session'
  }
};
