import redisClient from "../config/redis.js";

export const clearBookCache = async () => {
    try {
        const keys = [];

        for await (const key of redisClient.scanIterator({
            MATCH: "books:*",
            COUNT: 100,
        })) {
            keys.push(key);
        }

        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log("Book cache cleared");
        }
    } catch (error) {
        console.error("Error clearing book cache:", error);
    }
};