import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 600,
    message: { error: "Too many requests, please try again later." },
    headers: true,
});
