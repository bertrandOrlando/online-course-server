import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    FRONTEND_URL: Joi.string().required(),
    BACKEND_URL: Joi.string().required(),
    PORT: Joi.number().default(3000),
    PG_USER: Joi.string().required().description("PostgreSQL username"),
    PG_HOST: Joi.string().required().description("PostgreSQL host"),
    PG_DATABASE: Joi.string().required().description("PostgreSQL database"),
    PG_PASSWORD: Joi.string().required().description("PostgreSQL password"),
    PG_PORT: Joi.number().required().description("PostgreSQL port"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    MIDTRANS_SERVER_KEY: Joi.string().description("midtrans server API key"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  frontendUrl: envVars.FRONTEND_URL,
  backendUrl: envVars.BACKEND_URL,
  port: envVars.PORT,
  postgre: {
    user: envVars.PG_USER,
    host: envVars.PG_HOST,
    database: envVars.PG_DATABASE,
    password: envVars.PG_PASSWORD,
    port: envVars.PG_PORT,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      secure: false,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  midtrans: {
    serverKey: envVars.MIDTRANS_SERVER_KEY,
  },
};

export default config;
