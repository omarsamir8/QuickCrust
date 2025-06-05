// pages/api/orders/index.js
import { NextResponse } from "next/server";
import dbConnect from "@/util/mongo";
import Order from "@/models/Order";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const body = req.body; // استخدم req.body بدلاً من req.json() في Next.js API
      const { userId, customer, address, total, method } = body;

      // جلب بيانات المستخدم وسلته
      const user = await User.findById(userId).populate("cart.productId");
      if (!user) return res.status(404).json({ message: "User not found" });

      const cartItems = user.cart.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      // إنشاء الأوردر
      const order = await Order.create({
        userId,
        customer,
        address,
        total,
        method,
        products: cartItems,
      });

      // تحديث المستخدم بإضافة الأوردر
      user.orders.push({
        orderId: order._id,
        location: address,
      });

      // تفريغ السلة بعد الأوردر
      user.cart = [];

      await user.save();

      return res.status(201).json(order);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating order",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
  try {
    await dbConnect();

    // جلب كل الأوردرات وتفاصيل المنتجات المرتبطة بها
    const orders = await Order.find().populate("products.productId");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
}else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
