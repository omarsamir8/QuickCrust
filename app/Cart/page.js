import CartContainer from "../components/CartContainer/CartContainer";

export const metadata = {
    title: "User Cart",
    description: "Cart items and Option To Make order",
  };

export default function Cart(){
    return(
        <>
        <div className="cartpage">
            <CartContainer/>
        </div>
        </>
    )
}
