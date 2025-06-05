import dbConnect from "../../../util/mongo";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
export default async function handler(req,res){
    const {method}=req;
    await dbConnect();
    if(method==="GET"){
        try{
            const users=await User.find();
            res.status(201).json(users)
        }catch(err){
            res.status(500).json(err)
        }
    }


    if (req.method === "POST") {
        try {
            const { name, email, password, phone,role } = req.body;
            // تأكد من عدم تكرار البريد الإلكتروني
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists!" });
            }

            // تشفير كلمة المرور قبل الحفظ
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // إنشاء المستخدم
            const newUser = new User({
                name,
                email,
                phone,
                role,
                password: hashedPassword, // تخزين كلمة المرور المشفرة
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully!" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        } 
    }  
    }
