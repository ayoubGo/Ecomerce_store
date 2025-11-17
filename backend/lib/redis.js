import Redis from "ioredis";
import dotenv from "dotenv";



dotenv.config();

export const redis = new Redis(process.env.REDIS_URL);


await redis.set("abbb", "ayyy");  // so we can test the connection