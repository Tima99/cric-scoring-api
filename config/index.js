import dotenv from "dotenv"
dotenv.config()

export const {
    PORT,
    DOMAIN,
    DB_URL,
    JWT_SECRET_KEY,
    RESEND_API_KEY,
    EMAIL_FROM
} = process.env
