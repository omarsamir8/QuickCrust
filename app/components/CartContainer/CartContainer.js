'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { useAuth } from '@/context/AuthContext';
import { useAuth } from '../../../context/AuthContext';

function CartContainer() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newquantity, setnewquantity] = useState("");
  const [customer, setcustomer] = useState("");
  const [total, settotal] = useState(0); // متغير لتخزين إجمالي السعر
  const [method, setmethod] = useState("");
  const [address, setaddress] = useState("");

  // جلب السلة
  const GetCartProducts = async () => {
    if (!user?._id) return;
    try {
      const response = await axios.get(`http://localhost:3000/api/cart?userId=${user._id}`);
      console.log(response.data);
      setCartItems(response.data.cart);

      // حساب إجمالي الأسعار
      const totalPrice = response.data.cart.reduce((sum, item) => {
        const productPrice = Array.isArray(item.productId.prices) && item.productId.prices.length > 0 ? item.productId.prices[0] : 0;
        return sum + productPrice * item.quantity;
      }, 0);

      settotal(totalPrice); // تخزين إجمالي السعر في المتغير
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("❌ Failed to fetch products!", { position: "top-center" });
    }
  };

  // حذف منتج من السلة
  const handleRemoveFromCart = async (productId) => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/cart', {
        action: 'remove',
        userId: user._id,
        productId,
      });
      setCartItems(response.data.cart);
      toast.success("🗑️ Product removed successfully", { position: "top-center" });
      GetCartProducts();
    } catch (err) {
      console.error("Error removing product:", err);
      toast.error("❌ Failed to remove product!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCartProducts();
  }, [user]);

  // تحديث الكمية
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart', {
        action: "update",
        userId: user._id,
        productId,
        quantity: parseInt(newQuantity),
      });
      setCartItems(response.data.cart);
      toast.success("✅ Quantity Updated!", { position: "top-center" });
      GetCartProducts();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("❌ Failed to update quantity", { position: "top-center" });
    }
  };

  // تنفيذ الطلب
  const makeOrder = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/orders", {
        userId: user._id,
        customer,
        address,
        total, // إرسال المجموع الكلي مع الطلب
        method,
      });
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Order placed successfully!");
        GetCartProducts();
      }
    } catch (error) {
      toast.error("❌ Failed to place order");
      console.error(error);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛒 Your Cart</h2>
      <div className="table-responsive cartcontainer">
        <table style={{ borderRadius: "10px" }} className="table table-bordered table-hover text-center shadow">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Size</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>New Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.filter(item => item.productId).length === 0 ? (
              <tr>
                <td colSpan="8">Your cart is empty.</td>
              </tr>
            ) : (
              cartItems.filter(item => item.productId).map((item) => (
                <tr key={item._id}>
                  <td>
                    <Image
                      src={item.productId.img || "/Assets/burger.jpg"}
                      alt="image of product"
                      width={40}
                      height={30}
                      style={{ borderRadius: '8px' }}
                    />
                  </td>
                  <td>{item.productId.title}</td>
                  <td>{item.size || 'N/A'}</td>
                  <td>
                    {Array.isArray(item.productId.prices) && item.productId.prices.length > 0
                      ? `£${item.productId.prices[0].toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    {Array.isArray(item.productId.prices) && item.productId.prices.length > 0
                      ? `£${(item.productId.prices[0] * item.quantity).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      onChange={(e) => setnewquantity(e.target.value)}
                      className="form-control form-control-sm"
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveFromCart(item.productId._id)}
                      disabled={loading}
                    >
                      ❌ Remove
                    </button>
                    <button
                      style={{ marginLeft: "10px", paddingLeft: "20px", paddingRight: "20px" }}
                      className="btn btn-primary btn-sm"
                      disabled={loading}
                      onClick={() => { handleQuantityChange(item._id, newquantity) }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <h5>Total: <span style={{color:"red",fontFamily:"cursive",fontSize:"18px"}}>{total}</span> </h5>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Make Order
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Making Order</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <input onChange={(e) => { setcustomer(e.target.value) }} type="text" className="form-control" placeholder="Customer User Name" aria-label="Recipient's username" />
                <input onChange={(e) => { setaddress(e.target.value) }} type="text" className="form-control" placeholder="Customer Address" aria-label="Recipient's username" />
                <input value={total} readOnly type="text" className="form-control" placeholder="Total Price" aria-label="Recipient's username" />
                <select
                  onChange={(e) => setmethod(e.target.value)}
                  className="form-select"
                  aria-label="Default select example"
                  defaultValue=""
                >
                  <option value="" disabled>Select Order Method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button onClick={() => { makeOrder() }} type="button" className="btn btn-primary">Make Order</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    </div>
  );
}

export default CartContainer;
