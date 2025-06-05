import CartContainer from "../components/CartContainer/CartContainer";

export const metadata = {
    title: "User Cart",
    description: "Cart items and Option To Make order",
  };

export default function Loginpage(){
    return(
        <>
        <div className="cartpage">
            <CartContainer/>
        </div>
        </>
    )
}
