import Image from 'next/image';
import './Menu.css'
import FoodMenu from '../components/FoodMenu/FoodMenu';
export const metadata = {
    title: "QuickCrust Menu",
    description: "QuickCrust Menu Have All Products At Resturant",
  };
export default function Menu(){
    return(
        <>
        <div className='menupage'>
            <Image src="/Assets/menu.png" alt="Menu Image" width={1000} height={200} />
            <FoodMenu/>
        </div>   
        </>
    )
}