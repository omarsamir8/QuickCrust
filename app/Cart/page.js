'use client';
import CartContainer from "../components/CartContainer/CartContainer";


export const metadata = {
  title: "User Cart",
  description: "Cart items and Option To Make order",
};

export default function CartPage() {
  return (
    <div className="cartpage">
      <CartContainer />
    </div>
  );
}
