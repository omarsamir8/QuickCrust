'use client';
import './ProductControl.css';
import { useEffect, useState } from "react"; 
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';


function ProductControl(){
    const [allproducts, setAllProducts] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState("");
    const [minPrice, setMinPrice] = useState();
    const [avrPrice, setAvrPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [extraOptionstext, setExtraOptionsText] = useState("");
    const [extraOptionsprice, setExtraOptionsPrice] = useState("");
    const [filter, setFilter] = useState(""); // فلترة حسب الاسم
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    
    // إنشاء منتج جديد
    const CreateProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("prices", JSON.stringify([minPrice, avrPrice, maxPrice]));
            formData.append("extraOptions", JSON.stringify([{ text: extraOptionstext, price: extraOptionsprice }]));
            if (img) {
                formData.append("img", img);
            }

            const response = await axios.post("http://localhost:3000/api/products", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("🎉 Product Created Successfully!", { position: "top-center" });

            setAllProducts([...allproducts, response.data]);
        } catch (err) {
            toast.error("❌ Product Creation Failed!", { position: "top-center" });
        }
    };
    // جلب جميع المنتجات
    const GetProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/products"); 
            setAllProducts(response.data); // تخزين البيانات في حالة الاستخدام
            toast.success("🎉 Products Data Retrieved!", { position: "top-center" });
            console.log(response.data)
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("❌ Failed to fetch products!", { position: "top-center" });
        }
    };

    useEffect(() => {
        GetProducts();
    }, []);

    // تصفية المنتجات بناءً على البحث
    const filteredProducts = allproducts.filter(product =>
        product.title.toLowerCase().includes(filter.toLowerCase())
    );

    // 🔥 دالة حذف المنتج
const DeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
        await axios.delete(`http://localhost:3000/api/products/${id}`);
        toast.success("🗑️ Product Deleted Successfully!", { position: "top-center" });

        // ✅ تحديث حالة المنتجات بعد الحذف
        setAllProducts(allproducts.filter(product => product._id !== id));
    } catch (err) {
        console.error("Product Deletion Error:", err.response?.data || err.message);
        toast.error("❌ Failed to delete product!", { position: "top-center" });
    }
};

//  Update Product
const UpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("prices", JSON.stringify([minPrice, avrPrice, maxPrice]));
        formData.append("extraOptions", JSON.stringify([{ text: extraOptionstext, price: extraOptionsprice }]));

        if (img && typeof img === "object") {
            formData.append("img", img);  // ✅ إرسال الصورة الجديدة
        } else if (typeof img === "string") {
            formData.append("img", img);  // ✅ الاحتفاظ بالمسار السابق إذا لم يتم اختيار صورة جديدة
        }

        const response = await axios.put(
            `http://localhost:3000/api/products/${selectedProduct._id}`, 
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        toast.success("✅ Product Updated Successfully!", { position: "top-center" });

        // ✅ تحديث القائمة بعد التعديل بدون إعادة تحميل الصفحة
        setAllProducts(allproducts.map(p => p._id === selectedProduct._id ? response.data : p));
    } catch (err) {
        console.error("❌ Product Update Error:", err.response?.data || err.message);
        toast.error("❌ Failed to update product!", { position: "top-center" });
    }
};

    return (
        <>
        <div className="productcontrol">
            <div className='protop'>
                <p>Showing {filteredProducts.length} Results</p>                   
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add New Product
                </button>
            </div>

            <input 
                type="text"
                className="form-control mt-3 mb-3"
                placeholder="🔍 Search for a product..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />  
            <div className='displayproducts'>
                <table style={{textAlign:"center"}} className="table table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Min Price</th>
                            <th>Avr Price</th>
                            <th>Max Price</th>
                            <th>Extra Options</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{product.title}</td>
                                    <td>{product.description}</td>
                                    <td>{product.prices?.[0]}</td>
                                    <td>{product.prices?.[1]}</td>
                                    <td>{product.prices?.[2]}</td>
                                    <td>
                                        {product.extraOptions?.map((opt, i) => (
                                            <span key={i}>{opt.text} With Price ${opt.price} <br/></span>
                                        ))}
                                    </td>
                                    <td>
                                        {product.img ? (
                                            <img src={product.img} alt={product.title} width="30" height="35" />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td style={{display:"flex",gap:"10px",alignItems:"center"}}>
                                    <button 
                                            type="button" 
                                            className="btn btn-primary" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#exampleModal2"
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setTitle(product.title);
                                                setDescription(product.description);
                                                setMinPrice(product.prices[0]);
                                                setAvrPrice(product.prices[1]);
                                                setMaxPrice(product.prices[2]);
                                                setImg(product.img);
                                                setExtraOptionsText(product.extraOptions.length > 0 ? product.extraOptions[0].text : "");
                                                setExtraOptionsPrice(product.extraOptions.length > 0 ? product.extraOptions[0].price : "");
                                            }}
                                        >
                                            Update 
                                        </button>

                                            <button 
                                                type="button" 
                                                className="btn btn-danger" 
                                                onClick={() => DeleteProduct(product._id)}
                                            >
                                                Delete 
                                            </button>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">No Products Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add New Product</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row">
                                <input  onChange={(e)=>setTitle(e.target.value)} className="form-control col-6 mb-2" placeholder="Product Name"/>
                                <input onChange={(e)=>setDescription(e.target.value)} className="form-control col-6 mb-2" placeholder="Product Description"/>
                                <input onChange={(e)=>setMinPrice(e.target.value)} className="form-control col-4 mb-2" placeholder="Min Price"/>
                                <input onChange={(e)=>setAvrPrice(e.target.value)} className="form-control col-4 mb-2" placeholder="Avrage Price"/>
                                <input onChange={(e)=>setMaxPrice(e.target.value)} className="form-control col-4 mb-2" placeholder="Max Price"/>
                                <input 
                                        onChange={(e) => setImg(e.target.files[0])} 
                                        className="form-control col-6 mb-2" 
                                        type="file"
                                />                
                                <input onChange={(e)=>setExtraOptionsText(e.target.value)} className="form-control col-6 mb-2" placeholder="Extra Option Text"/>
                                <input onChange={(e)=>setExtraOptionsPrice(e.target.value)} className="form-control col-6 mb-2" placeholder="Extra Option Price"/>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={CreateProduct} type="button" className="btn btn-primary">Add Product</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Update Product</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row">
                                <input value={title || ""}  onChange={(e)=>setTitle(e.target.value)} className="form-control col-6 mb-2" placeholder="Product Name"/>
                                <input value={description || ""} onChange={(e)=>setDescription(e.target.value)} className="form-control col-6 mb-2" placeholder="Product Description"/>
                                <input value={minPrice || ""} onChange={(e)=>setMinPrice(e.target.value)} className="form-control col-4 mb-2" placeholder="Min Price"/>
                                <input value={avrPrice || ""} onChange={(e)=>setAvrPrice(e.target.value)} className="form-control col-4 mb-2" placeholder="Avrage Price"/>
                                <input value={maxPrice || ""} onChange={(e)=>setMaxPrice(e.target.value)} className="form-control col-4 mb-2" placeholder="Max Price"/>
                                <input 
                                        
                                        onChange={(e) => setImg(e.target.files[0])} 
                                        className="form-control col-6 mb-2" 
                                        type="file"
                                />                
                                <input value={extraOptionstext || ""} onChange={(e)=>setExtraOptionsText(e.target.value)} className="form-control col-6 mb-2" placeholder="Extra Option Text"/>
                                <input value={extraOptionsprice || ""} onChange={(e)=>setExtraOptionsPrice(e.target.value)} className="form-control col-6 mb-2" placeholder="Extra Option Price"/>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={UpdateProduct} type="button" className="btn btn-primary">Update Product</button>
                            </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
        </>
    )
}

export default ProductControl;
