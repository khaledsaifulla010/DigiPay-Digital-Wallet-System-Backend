import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
}
const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "DATABASE_URL"];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
  };
};

export const envVars = loadEnvVariables();
