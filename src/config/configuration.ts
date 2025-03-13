import { env } from "process";

export default () => ({
    PORT: parseInt(env.PORT || "2001", 10),
    CORS_OPTIONS: {
        method: "POST,GET,PATCH,DELETE",
        credentials: true,
        origin: true,
        allowHeaders: 'Content-Type,Authorization'
    }
})