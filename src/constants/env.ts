const getEnv = (key: string, defaltvalue?: string): string => {
    const value = process.env[key] || defaltvalue;

    if (value === undefined) {
        throw new Error(`Missing environment variable ${key}`);
    }
    return value;
};

export const MONGODB_URL = getEnv("MONGODB_URL");
export const PORT = getEnv("PORT");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const NODE_ENV = getEnv("NODE_ENV");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const SENDER_EMAIL = getEnv("SENDER_EMAIL");
export const NODEMAILER_PASSWORD = getEnv("NODEMAILER_PASSWORD");
export const CLOUDINARY_CLOUD_NAME = getEnv("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");