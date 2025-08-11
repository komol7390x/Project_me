import { rateLimit, ipKeyGenerator } from 'express-rate-limit'
import { Role } from '../const/Role.js'

export const requestLimiter = (seconds, limit, role) => {
    return rateLimit({
        windowMs: seconds * 1000,
        max: limit,
        skip: (_req) => role === Role.SUPERADMIN,
        keyGenerator: (req) => {
            return ipKeyGenerator(req.ip) || req.body?.username || req.body?.phoneNumber;
        },
        message: {
            status: 429,
            message: 'Too many requests'
        },
        legacyHeaders: true,
        standardHeaders: true
    });
};


