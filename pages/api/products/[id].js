import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";
import multer from "multer";
import path from "path";
import fs from "fs";

// إعداد `multer` لتخزين الصور في `public/uploads`
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// تعطيل المعالجة التلقائية للـ bodyParser في Next.js
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    const { method, query: { id } } = req;
    await dbConnect();

    if (method === "GET") {
        try {
            const product = await Product.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    if (method === "PUT") {
        upload.single("img")(req, res, async function (err) {
            if (err) return res.status(500).json({ error: err.message });

            try {
                const { title, description, prices, extraOptions } = req.body;
                let updatedData = {
                    title,
                    description,
                    prices: JSON.parse(prices),
                    extraOptions: JSON.parse(extraOptions),
                };

                // ✅ التحقق من الصورة
                if (req.file) {
                    updatedData.img = `/uploads/${req.file.filename}`;
                } else if (typeof req.body.img === "string") {
                    updatedData.img = req.body.img;
                }

                const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
                res.status(200).json(product);
            } catch (err) {
                res.status(500).json(err);
            }
        });
    }

    if (method === "DELETE") {
        try {
            await Product.findByIdAndDelete(id);
            res.status(200).json("The product has been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}
