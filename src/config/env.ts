// Environment configuration with safe fallbacks
export const ENV_CONFIG = {
  CBE_ACCOUNT_NUMBER: (import.meta.env.VITE_CBE_ACCOUNT_NUMBER as string) || '1000167413618',
  FOUNDER_NAME_AM: 'ዘበነ አስፍዬ',
  FOUNDER_NAME_EN: 'Zebene Asfye',
  CHAPA_PUBLIC_KEY: (import.meta.env.VITE_CHAPA_PUBLIC_KEY as string) || 'CHAPUBK_TEST_OW_SECURE',
  CHAPA_API_URL: (import.meta.env.VITE_CHAPA_API_URL as string) || 'https://api.chapa.co/v1',
  WS_URL: (import.meta.env.VITE_WS_URL as string) || ''
};
