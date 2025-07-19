import { env } from "process";

export default () => ({
    PORT: parseInt(env.PORT || "2001", 10),
    CORS_OPTIONS: {
        method: "POST,GET,PATCH,DELETE",
        credentials: true,
        origin: true,
        allowHeaders: 'Content-Type,Authorization'
    },
    MONGO_CONNECTION: {
        uri: env.MONGO_URI || "mongodb://localhost:27017",
        dbName: env.MONGO_DB_NAME ,
        retryAttempts: 3,
        retryDelay: 1000,
    }
})