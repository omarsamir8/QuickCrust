'use client'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faMapMarkerAlt, faUser,faSignOutAlt  } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import './Navbar.css';
import Link from "next/link";

function Navbar() {
    const { user, logoutUser } = useAuth();
console.log(user)
    return (
        <div className="navbar">
            <h2>QuickCrust</h2>
            <ul>
                <Link style={{textDecoration:"none"}} href="/"><li>Home</li></Link>
                <Link style={{textDecoration:"none"}} href="/Menu"><li>Menu</li></Link> 
                {user&&user.role==="admin"? <Link style={{textDecoration:"none"}} href="/Dashboard">
                    <li>Dashbard</li>
                </Link>:null}
                <Link style={{textDecoration:"none"}} href="/Cart">
                    <li>
                        Cart
                        <FontAwesomeIcon style={{ width: "20px", color: "green" }} icon={faShoppingCart} className="me-2" />
                    </li>
                </Link>
                <Link style={{textDecoration:"none"}} href="/OrderTracking">
                    <li>
                        Order Tracking
                        <FontAwesomeIcon style={{ width: "15px", color: "green" }} icon={faMapMarkerAlt} className="me-2" />
                    </li>

                </Link>
                {user ? (
                    <li onClick={logoutUser} style={{ cursor: "pointer" }}>
                       Welcom {user.name} <FontAwesomeIcon style={{ width: "17px", color: "green" }} icon={faSignOutAlt} className="me-2" />
                    </li>
                ) : (
                    <Link style={{textDecoration:"none"}} href='/LoginPage'>
                        <li>
                            Login 
                            <FontAwesomeIcon style={{ width: "17px", color: "green" }} icon={faUser} className="me-2" />
                        </li>
                    </Link>
                )}
            </ul>
        </div>
    );
}

export default Navbar;
