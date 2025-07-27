import { rateLimit, ipKeyGenerator } from 'express-rate-limit'

export const requestLimit = (sec, limit) => {

    const limiter = rateLimit({

        windowMs: sec * 1000,         // ⏱ Necha soniyalik oynada cheklash (ms ga o‘giradi)
        limit,                            // 🔢 Shu oynada maksimal necha so‘rovga ruxsat

        skip: (req, _) => req.user?.role === 'SUPERADMIN',
        // 🛡 SUPERADMIN foydalanuvchilar uchun cheklov ishlamaydi

        skipSuccessfulRequests: true,
        // ✅ Faqat xatolik (masalan: xato login) so‘rovlari hisoblanadi

        keyGenerator: (req, _) => {
            // 🔑 Kim uchun limit qo‘llanishini aniqlash (IP yoki username/phone)
            return ipKeyGenerator(req.ip) || (req.body.username ?? req.body.phoneNumber);
        },

        message: {
            status: 429,
            message: 'Too many request'   // 🚫 Limitdan oshilganda qaytariladigan xabar
        },

        legacyHeaders: true,              // 🧾 Eski X-RateLimit-* header'larni yuboradi
        standardHeaders: 'draft-6'        // 📄 Yangi RateLimit-* header formatini ishlatadi
    })
}