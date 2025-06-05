import dbConnect from "../../../util/mongo";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    const { method, query: { id } } = req;
    await dbConnect();

    if (method === "GET") {
        try {
            const user = await User.findById(id);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    if (method === "PUT") {
        try {
            const updateData = { ...req.body };

            // إذا كانت كلمة المرور موجودة، نقوم بتشفيرها قبل الحفظ
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(req.body.password, salt);
            }

            const user = await User.findByIdAndUpdate(id, updateData, { new: true });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    if (method === "DELETE") {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json("The user has been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}
