import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  customer: { type: String, required: true },
  address: { type: String, required: true },
  total: { type: Number, required: true },
  method: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "on way", "delivered", "cancelled"],
    default: "pending",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
    }
  ],
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
