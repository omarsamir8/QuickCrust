import Image from 'next/image';
import './Hero.css'
function Hero(){
    return (
        <>
        <div className="Hero">
            <div className="Hero-left">
                <h2>Delicious Food Is Waiting For You</h2>
                <p>Our team of registered chefs and skilled culinary professionals provide the best meal recipes and services.</p>
                <button>Food Menu</button>
            </div>
            <div className="Hero-Right">
            <Image src="/Assets/burger.jpg" alt="Hero Image" width={400} height={400} />
            </div>
        </div>
        </>
    )
}
export default Hero;