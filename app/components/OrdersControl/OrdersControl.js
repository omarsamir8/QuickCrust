'use client';
import { useEffect, useState } from "react"; 
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

function OrderControl() {
    const [orders, setorders] = useState([]);
    const [status, setstatus] = useState("");
    const [selectedid, setselectedid] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // ✅ حالة البحث

    // جلب جميع الطلبات
    const GetOrders = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/orders"); 
            setorders(response.data);
            toast.success("🎉 Orders Data Retrieved!", { position: "top-center" });
        } catch (err) {
            console.error("Error fetching Orders:", err);
            toast.error("❌ Failed to fetch Orders!", { position: "top-center" });
        }
    };

    useEffect(() => {
        GetOrders();
    }, []);
    console.log(orders);
    // حذف الطلب
    const DeleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Order?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/orders/${id}`);
            toast.success("🗑️ Order Deleted Successfully!", { position: "top-center" });
            setorders(orders.filter(order => order._id !== id));
        } catch (err) {
            console.error("Order Deletion Error:", err.response?.data || err.message);
            toast.error("❌ Failed to delete Order!", { position: "top-center" });
        }
    };

    // تحديث حالة الطلب
    const UpdateOrder = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/orders/${selectedid}`,
                { status }
            );
            toast.success("✅ Order Status Updated Successfully!", { position: "top-center" });
            setorders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === selectedid ? { ...order, status } : order
                )
            );
            setstatus("");
            setselectedid("");
        } catch (err) {
            console.error("❌ Order Update Error:", err.response?.data || err.message);
            toast.error("❌ Failed to update order!", { position: "top-center" });
        }
    };

    // ✅ تصفية الطلبات حسب البحث
    const filteredOrders = orders.filter((order) =>
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="productcontrol">
                <div className='protop'>
                    <p>Showing {filteredOrders.length} Results</p>                   
                </div>

                <input 
                    type="text"
                    className="form-control mt-3 mb-3"
                    placeholder="🔍 Search by customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />  

                <div className='displayproducts'>
                    <table style={{ textAlign: "center" }} className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Method</th>
                                <th>Total</th>
                                <th>CreatedAt</th>
                                <th>Order Products</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((ord, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{ord.customer}</td>
                                    <td>{ord.address}</td>
                                    <td>{ord.status}</td>
                                    <td>{ord.method}</td>
                                    <td>{ord.total}</td>
                                    <td>{new Date(ord.updatedAt).toLocaleString()}</td>
                                    <td>
                                         {ord.products.map((pro)=>{
                                        return (
                                            <>
                                            <p>{pro.quantity} of {pro.productId.title} </p>
                                            </>
                                        )
                                    })}</td>
                                   
                                    <td style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
                                        <button 
                                            type="button" 
                                            className="btn btn-primary" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#exampleModal2"
                                            onClick={() => setselectedid(ord._id)}
                                        >
                                            Change Status 
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-danger" 
                                            onClick={() => DeleteOrder(ord._id)}
                                        >
                                            Delete 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal لتحديث الحالة */}
                <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Update Order Status</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <form className="row">
                                    <select 
                                        onChange={(e) => setstatus(e.target.value)} 
                                        className="form-select" 
                                        aria-label="Default select example"
                                        value=""
                                    >
                                        <option selected>Select Order Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="on way">On Way</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={UpdateOrder} type="button" className="btn btn-primary">Update Status</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default OrderControl;
