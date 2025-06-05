import Image from "next/image";
import './Potato.css'
function Potato(){
    return (
        <>
        <div className="potato">
            <Image src="/Assets/potato.jpg" alt="Potato Image" width={800} height={500} />
            <div className="potatoDetails">
                <h2>Best Potatoes For Frensh Fries</h2>
                <p>Best Potatoes for French Fries 🍟
                When making perfect crispy French fries, the choice of potato plays a huge role. The best potatoes have a high starch content and low moisture, ensuring a crispy exterior and fluffy interior.
                🥔 Top Potato Varieties for French Fries
Russet Potatoes (Idaho Potatoes) – Best Choice!

High starch, low moisture → Extra crispy fries.

Fluffy inside, golden-brown crust.

Ideal for deep frying.
                </p>
            </div>
        </div>
        </>
    )
}
export default Potato;