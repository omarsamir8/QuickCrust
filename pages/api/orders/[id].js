import dbConnect from "../../../util/mongo";
import Order from "../../../models/Order";

const handler = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.status(200).json(order);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else if (method === "PUT") {
    try {
      const { status } = req.body;
  
      // optional: تأكد إن الـ status من القيم المسموحة
      const allowedStatuses = ["pending", "processing", "on way", "delivered", "cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
  
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      return res.status(200).json(order);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  
   else if (method === "DELETE") {
    try {
      await Order.findByIdAndDelete(id);
      return res.status(200).json("The order has been deleted!");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
