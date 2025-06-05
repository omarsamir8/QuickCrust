import dbConnect from "../../util/mongo";// استدعاء ملف الاتصال بقاعدة البيانات
import User from "../../models/User"; // استدعاء موديل المستخدم
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // الاتصال بقاعدة البيانات
        await dbConnect();

        const { email, password } = req.body;

        // البحث عن المستخدم في قاعدة البيانات
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Wrong Credentials!" });
        }

        // إنشاء التوكن
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // إرسال التوكن مع الرد
        res.status(200).json({ message: "Successful login", token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
