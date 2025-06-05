'use client';
import { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [name, setname] = useState("");
    const [phone, setphone] = useState("");
    const [role, setrole] = useState("user");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const login = async (e) => {
        e.preventDefault(); // Prevents page refresh

        try {
            const response = await axios.post("http://localhost:3000/api/users", {
                email,
                password,
                name,
                phone,
                role
            });
            toast.success("🎉 SignUp Done Successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
        
            console.log("SignUp Done successful:", response.data);
            setError(null);
            setTimeout(() => {
                window.location.href="/LoginPage"
            }, 1000);
        } catch (err) {
            toast.error(`❌ SignUp Failed!${err.response?.data.error || err.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className='signuppage'>
            <h2>User SignUp</h2>
            <form onSubmit={login}>
                <input 
                    type="name" 
                    name="name" 
                    placeholder="User Name" 
                    value={name} 
                    onChange={(e) => setname(e.target.value)} 
                    required 
                />
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
                <input 
                    type="phone" 
                    name="phone" 
                    placeholder="User Phone" 
                    value={phone} 
                    onChange={(e) => setphone(e.target.value)} 
                    required 
                />
                {/* <input 
                    type="role" 
                    name="role" 
                    placeholder="User Role" 
                    value={role} 
                    onChange={(e) => setrole(e.target.value)} 
                    required 
                /> */}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button className='submitbutton' type="submit">Sign Up</button>
            </form>
            <ToastContainer />
        </div>
    );
}