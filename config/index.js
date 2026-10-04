import dotenv from "dotenv"
dotenv.config()

export const {
    DOMAIN,
    DB_URL,
    JWT_SECRET_KEY,
    RESEND_API_KEY,
    EMAIL_FROM
} = process.env

// AppSail injects X_ZOHO_CATALYST_LISTEN_PORT; PORT is the local-dev fallback
export const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || 9000
