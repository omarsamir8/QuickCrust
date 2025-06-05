import './OurServices.css'
import { CalendarCheck } from "lucide-react";
import { Grid } from "lucide-react";  
import { UserCheck } from "lucide-react";  
import { Truck } from "lucide-react";  
import { Timer, UtensilsCrossed } from "lucide-react"; 
 function OurServices(){
    return (
        <>
        <h2 style={{color:"black",textAlign:"center",fontFamily:"monospace",fontSize:"26px"}}>Our Services</h2>
        <div className="services">
            <div className="service">
                <CalendarCheck size={32} className="text-blue-500" />
                <p>Online bokking</p>
            </div>
            <div className="service">
                <Grid size={32} className="text-green-500" />
                <p>Catering Service</p>
            </div>
            <div className="service">
                <UserCheck size={32} className="text-yellow-500" />
                <p>MemberShip</p>
            </div>
            <div className="service">
                <Truck size={32} className="text-red-500" />
                <p>Delievry Service</p>
            </div>
            <div className="service">
                <Timer size={32} className="text-red-500" />
                <p>Fast Food Preparation </p>
            </div>
            <div className="service">
                <UtensilsCrossed size={32} className="text-red-500" />
                <p>Fresh Good Food</p>
            </div>
        </div>
        </>
    )
}
export default OurServices;