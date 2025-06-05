import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";
import multer from "multer";
import path from "path";
import fs from "fs";

// إعداد تخزين الملفات في مجلد "public/uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // اسم فريد لكل صورة
    },
});

const upload = multer({ storage });

// منع Next.js من تفعيل المعالجة التلقائية للملفات
export const config = { api: { bodyParser: false } };

// API Handler
export default async function handler(req, res) {
    const { method } = req;
    await dbConnect();

    if (method === "GET") {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    if (method === "POST") {
        upload.single("img")(req, res, async function (err) {
            if (err) return res.status(500).json({ error: err.message });

            try {
                const { title, description, prices, extraOptions } = req.body;
                const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

                const product = await Product.create({
                    title,
                    description,
                    prices: JSON.parse(prices), // تحويل النص إلى مصفوفة
                    img: imgPath,
                    extraOptions: JSON.parse(extraOptions), // تحويل النص إلى مصفوفة
                });

                res.status(201).json(product);
            } catch (err) {
                res.status(500).json(err);
            }
        });
    }
}
