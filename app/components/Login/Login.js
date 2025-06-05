"use client";
import './login.css';
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { loginUser } = useAuth();

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      loginUser(response.data.user); // ✅ حفظ بيانات المستخدم في localStorage
      setError(null);

      toast.success("🎉 Login Done Successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000); // ✅ إعادة توجيه المستخدم بعد نجاح تسجيل الدخول

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred");

      toast.error("❌ Login Failed! Please check your credentials.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="loginpage">
      <h2>User Login</h2>
      <form onSubmit={login}>
        <input
          type="email"
          name="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          <span>New User?</span>
          <Link href="/SignUpPage">
          <ins style={{ cursor: "pointer" }}>Sign Up</ins>
          </Link>  
        </p>
        <button className="submitbutton" type="submit">Login</button>
      </form>

      <ToastContainer />
    </div>
  );
}
