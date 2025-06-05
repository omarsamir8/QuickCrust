'use client';

import "bootstrap/dist/css/bootstrap.min.css";
import './Dashbord.css';
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ProductControl = dynamic(() => import("../components/ProductControl/ProductControl"), { ssr: false });
const UserControl = dynamic(() => import("../components/UserControl/UserControl"), { ssr: false });
const OrderControl = dynamic(() => import("../components/OrdersControl/OrdersControl"), { ssr: false });

export default function DashboardNav() {
  const [selected, setSelected] = useState('products');

  // ✅ تحميل bootstrap.bundle.min.js في useEffect (فقط على العميل)
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div className="admindashboard">
      <div
        style={{
          height: "100px",
          backgroundColor: "transparent",
          width: "330px",
          margin: "auto",
          marginBottom: "20px",
        }}
        className="d-flex justify-content-center bg-light"
      >
        <div className="p-4 bg-white shadow rounded">
          <ul
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="list-unstyled"
          >
            <li
              onClick={() => setSelected("products")}
              style={{ cursor: "pointer" }}
              className="p-3 mb-2 text-white bg-primary rounded text-center fw-bold shadow-sm"
            >
              Product
            </li>
            <li
              onClick={() => setSelected("users")}
              style={{ cursor: "pointer" }}
              className="p-3 mb-2 text-white bg-success rounded text-center fw-bold shadow-sm"
            >
              Users
            </li>
            <li
              onClick={() => setSelected("orders")}
              style={{ marginTop: "-7px", cursor: "pointer" }}
              className="p-3 text-white bg-danger rounded text-center fw-bold shadow-sm"
            >
              Orders
            </li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: "20px" }} className="onlyComponent">
        {selected === "products" ? <ProductControl /> : null}
        {selected === "users" ? <UserControl /> : null}
        {selected === "orders" ? <OrderControl /> : null}
      </div>
    </div>
  );
}
