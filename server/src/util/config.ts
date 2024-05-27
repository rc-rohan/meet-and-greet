export const ENVIRONMENT_VAR = {
  MONGO_DB_URI: process.env.MONGO_DB_URI || '',
  PORT: Number(process.env.PORT ?? 8000),
  ENVIRONMENT: process.env.ENVIRONMENT || 'development',
};
