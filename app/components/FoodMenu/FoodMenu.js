"use client";
import './FoodMenu.css';
import Image from 'next/image';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext";

function FoodMenu(){
    const { user } = useAuth();
    const [allProducts, setAllProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [singleProduct, setSingleProduct] = useState([]);
    const [quantity, setQuantity] = useState();
    const [productsize, setProductSize] = useState('small');
    const [action] = useState("add");

    // جلب جميع المنتجات
    const GetProducts = async () => {
        try {
            const response = await axios.get("https://quick-crust.vercel.app/api/products"); 
            setAllProducts(response.data);
            toast.success("🎉 Products Data Retrieved!", { position: "top-center" });
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("❌ Failed to fetch products!", { position: "top-center" });
        }
    };

    useEffect(() => {
        GetProducts();
    }, []);

    const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(filter.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const GetSingleProducts = async (id) => {
        try {
            const response = await axios.get(`https://quick-crust.vercel.app/api/products/${id}`); 
            setSingleProduct(response.data);
            toast.success("🎉 Product Data Retrieved!", { position: "top-center" });
        } catch (err) {
            console.error("Error fetching product:", err);
            toast.error("❌ Failed to fetch product!", { position: "top-center" });
        }
    };

    const AddToCart = async (productId) => {
        try {
            await axios.post(`https://quick-crust.vercel.app/api/cart`, { quantity, productId, action, userId: user._id });
            toast.success("🎉 Product Added To Cart Successfully!", { position: "top-center" });
        } catch (err) {
            toast.error("❌ Product To Cart Failed!", { position: "top-center" });
        }
    };

    return (
        <>
            <div className="foodmenu">
                <div className='res'>
                    <p>Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} Results</p>
                    <input 
                        style={{ width: "25%" }}
                        type="text"
                        className="form-control mt-3 mb-3"
                        placeholder="🔍 Search for a product..."
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    /> 
                </div>
                <div className='menuitems'>
                    {currentProducts.map((product) => (
                        <div key={product._id}>
                            <Image
                                src={product?.img || "/images/placeholder.png"}
                                alt="Menu Item Image"
                                width={200}
                                height={200}
                            />
                            <h3 style={{ marginTop: "10px" }}>{product.title}</h3>
                            <p>£{product.prices[0]} | £{product.prices[1]} | £{product.prices[2]}</p>
                            <button
                                onClick={() => GetSingleProducts(product._id)}
                                style={{ color: "white", fontWeight: "bold" }}
                                className='btn'
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                            >
                                Add To Cart
                            </button>
                        </div>
                    ))}
                </div>

                <div className='pag'>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </div>

                {/* Modal */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content modelbooody">
                            <div className="modal-header hed">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Product Details</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body modelboody">
                                <div className='imgcont'>
                                    {singleProduct?.img ? (
                                        <Image
                                            src={singleProduct.img}
                                            alt="Product Image"
                                            width={400}
                                            height={300}
                                        />
                                    ) : (
                                        <Image
                                            src="/images/placeholder.png"
                                            alt="No image"
                                            width={400}
                                            height={300}
                                        />
                                    )}
                                </div>
                                <div className='singleProDetails'>
                                    <h2>{singleProduct?.title || "Loading Data"} </h2>
                                    <p>{singleProduct?.description || "Loading data"}</p>
                                    <h3>
                                        £{
                                            singleProduct?.prices &&
                                            (productsize === "small"
                                                ? singleProduct.prices[0]
                                                : productsize === "meduim"
                                                ? singleProduct.prices[1]
                                                : productsize === "large"
                                                ? singleProduct.prices[2]
                                                : null)
                                        }
                                    </h3>
                                    <div className='buttonsSize'>
                                        <button onClick={() => setProductSize('small')} className='bttn'>Small</button>
                                        <button onClick={() => setProductSize('meduim')} className='bttn'>Medium</button>
                                        <button onClick={() => setProductSize('large')} className='bttn'>Large</button>
                                    </div>
                                    <h3 style={{ color: "red", fontWeight: "bold", marginTop: "-10px" }}>
                                        {singleProduct?.extraOptions?.[0]?.text || null}
                                    </h3>  
                                    <h3 style={{ marginTop: "-15px" }}>
                                        £{singleProduct?.extraOptions?.[0]?.price || null}
                                    </h3>
                                    <input
                                        onChange={(e) => setQuantity(e.target.value)}
                                        style={{ display: "block", marginTop: "20px" }}
                                        type='number'
                                        placeholder='Enter Quantity'
                                    />
                                </div>
                            </div>
                            <div className="modal-footer fot">
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={() => AddToCart(singleProduct._id)} type="button" className="btn btn-outline-danger">Add To Cart</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ToastContainer />
            </div>
        </>
    );
}

export default FoodMenu;
