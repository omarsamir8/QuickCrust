import dbConnect from "../../../util/mongo";
import User from "../../../models/User";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect(); // الاتصال بقاعدة البيانات

  if (method === "POST") {
    const { action, userId, productId, quantity } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

      if (action === "add") {
        // ✅ إضافة منتج إلى السلة
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "المنتج غير موجود" });

        const existingProduct = user.cart.find(item => item.productId.toString() === productId);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          user.cart.push({ productId, quantity });
        }

        await user.save();
        return res.status(200).json({ message: "✔️ تم إضافة المنتج إلى السلة", cart: user.cart });

      } else if (action === "remove") {
        // ✅ إزالة منتج من السلة
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        return res.status(200).json({ message: "🗑️ تم إزالة المنتج من السلة", cart: user.cart });

      } else if (action === "update") {
        // ✅ تحديث كمية المنتج
        const item = user.cart.find(item => item._id.toString() === productId);
        if (!item) return res.status(404).json({ message: "العنصر غير موجود في السلة" });

        item.quantity = quantity;
        await user.save();
        return res.status(200).json({ message: "🔁 تم تحديث الكمية بنجاح", cart: user.cart });

      } else {
        return res.status(400).json({ message: "⚠️ إجراء غير صحيح" });
      }

    } catch (error) {
      return res.status(500).json({ message: "❌ خطأ في السيرفر", error: error.message });
    }
  }

  if (method === "GET") {
    // ✅ جلب معلومات السلة
    const { userId } = req.query;

    try {
      const user = await User.findById(userId).populate({
        path: "cart.productId",
        model: "Product",
        select: "title description img prices extraOptions"
      }).lean();

      if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

      return res.status(200).json({ cart: user.cart });

    } catch (error) {
      return res.status(500).json({ message: "❌ خطأ في السيرفر", error: error.message });
    }
  }

  return res.status(405).json({ message: "🚫 الطريقة غير مدعومة" });
}
