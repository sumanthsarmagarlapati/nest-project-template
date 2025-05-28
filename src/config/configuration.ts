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
    },
     RABBIT_MQ: `amqp://${env.RABBIT_MQ_USER}:${env.RABBIT_MQ_PASSWORD}@${env.RABBIT_MQ_HOST}:${env.RABBIT_MQ_PORT}/${env.RABBIT_MQ_VHOST}`,
})