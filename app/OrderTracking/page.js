'use client';
import { useAuth } from "@/context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './order.css'
function OrderTracking(){
    const { user } = useAuth();
    console.log(user);
    return (
        <>
        <div className="ordertrackingpage">
            <div className="ordertitle">
                <h2>My Orders</h2>
                <input 
                type="text"
                className="form-control mt-3 mb-3"
                placeholder="🔍 Search for Your Orders..."
            /> 
            </div>
            <div className="myorders">
                <div className="myorder">
                    
                </div>
            </div>
        </div>
        </>
    )
}
export default OrderTracking;