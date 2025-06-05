'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWhatsapp,
    faTwitter,
    faInstagram,
    faLinkedin,
    faFacebook,
  } from "@fortawesome/free-brands-svg-icons";
  import './Footer.css'
function Footer(){
    return (
        <>
        <div className="Footer">
            <ul>
                <li> <FontAwesomeIcon style={{width:"30px",color:"blue"}} icon={faFacebook} className="text-blue-600" /></li>
                <li> <FontAwesomeIcon style={{width:"30px",color:"green"}} icon={faWhatsapp} className="text-green-500" /></li>
                <li> <FontAwesomeIcon style={{width:"30px",color:"cyan"}} icon={faTwitter} className="text-blue-400" /></li>
                <li> <FontAwesomeIcon style={{width:"30px",color:"blueviolet"}} icon={faInstagram} className="text-pink-500" /></li>
                <li> <FontAwesomeIcon style={{width:"30px",color:"blue"}} icon={faLinkedin} className="text-blue-700" /></li> 
            </ul>
            <h2>QuickCrust</h2>
            <div className="address">
                <p>QuickCrust Resturant</p>
                <p>Club Street at Banha City</p>
                <p>Telphone1:01558849371</p>
                <p>Telphone2:0132436660</p>
            </div>
            <h5>CopyRight©OmarSamirIbrahim at 3/2025</h5>
        </div>
        </>
    )
}
export default Footer;