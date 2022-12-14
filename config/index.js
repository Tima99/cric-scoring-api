import dotenv from "dotenv"
dotenv.config()

export const {
    PORT,
    DOMAIN,
    DB_URL,
    JWT_SECRET_KEY,
    SMPT_HOST,
    SMPT_MAIL,
    SMPT_PASSWORD,
    SMPT_PORT,
    SMPT_SERVICE
} = process.env