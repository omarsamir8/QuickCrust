'use client';
// import './ProductControl.css';
import { useEffect, useState } from "react"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

function UserControl(){
    const [allUsers, setallUsers] = useState([]);
    const [filter, setFilter] = useState(""); 
    const[name,setname]=useState("");
    const[email,setemail]=useState("");
    const[phone,setphone]=useState("");
    const[role,setrole]=useState("");
    const[password,setpassword]=useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    console.log(name,email,password,phone,role)
    // Create User
    const CreateUser = async () => {
        try {
          const response = await axios.post("http://localhost:3000/api/users", {
            name,
            email,
            phone,
            role,
            password
          });
    
          console.log("User Created Successfully:", response.data);
          toast.success("🎉 User Created Successfully!", { position: "top-center" });
          
          // تحديث المنتجات بعد الإضافة
          setallUsers([...allUsers, response.data]);
        } catch (err) {
          console.error("User Creation Error:", err.response?.data || err.message);
          toast.error("❌ User Creation Failed!", { position: "top-center" });
        }
    };
    // get all users
    const GetUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users"); 
            setallUsers(response.data); // تخزين البيانات في حالة الاستخدام
            toast.success("🎉 Users Data Retrieved!", { position: "top-center" });
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("❌ Failed to fetch Users!", { position: "top-center" });
        }
    };

    useEffect(() => {
        GetUsers();
    }, []);

    // تصفية المنتجات بناءً على البحث
    const filteredUsers = allUsers.filter(user =>
        user.name?.toLowerCase().includes(filter.toLowerCase())
    );
    

    // 🔥 دالة حذف المنتج
const DeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        setallUsers(allUsers.filter(user => user._id !== id));
        toast.success("🗑️ User Deleted Successfully!", { position: "top-center" });
        // ✅ تحديث حالة المنتجات بعد الحذف
        
    } catch (err) {
        console.error("User Deletion Error:", err.response?.data || err.message);
        toast.error("❌ Failed to delete User!", { position: "top-center" });
    }
};

    const LoadUserData = (user) => {
        setSelectedUserId(user._id); // حفظ الـ ID الخاص بالمستخدم
        setname(user.name);
        setemail(user.email);
        setphone(user.phone);
        setrole(user.role);
    };

    // update user
    const UpdateUser = async () => {
        try {
            await axios.put(`http://localhost:3000/api/users/${selectedUserId}`, {
                name,
                email,
                phone,
                role,
                password: password || undefined // إذا لم يتم تغيير الباسورد، لا نرسله
            });
    
            toast.success("✅ User Updated Successfully!", { position: "top-center" });
    
            // تحديث حالة المستخدمين بعد التعديل
            setallUsers((prevUsers) =>
                prevUsers.map(user =>
                    user._id === selectedUserId ? { ...user, name, email, phone, role } : user
                )
            );
    
        } catch (err) {
            console.error("User Update Error:", err.response?.data || err.message);
            toast.error("❌ Failed to update User!", { position: "top-center" });
        }
    };
    


    return (
        <>
        <div className="productcontrol">
            <div className='protop'>
                <p>Showing {filteredUsers.length} Results</p>                   
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Create User
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.role}</td>    
                                    <td style={{display:"flex",gap:"10px",alignItems:"center",justifyContent:"center"}}>
                                    <button 
                                            type="button" 
                                            className="btn btn-primary" 
                                            data-bs-toggle="modal" 
                                            data-bs-target="#exampleModal2"
                                            onClick={() => LoadUserData(user)} 
                                        >
                                            Update 
                                        </button>

                                        <button 
                                            type="button" 
                                            className="btn btn-danger" 
                                            onClick={() => DeleteUser(user._id)}
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
            {/* Create Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Create User</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row">
                                <input type="text" onChange={(e)=>{setname(e.target.value)}} className="form-control col-6 mb-2" placeholder="User Name"/>
                                <input type="email" onChange={(e)=>{setemail(e.target.value)}} className="form-control col-6 mb-2" placeholder="User Email"/>
                                <input type="text" onChange={(e)=>{setphone(e.target.value)}} className="form-control col-4 mb-2" placeholder="User Phone"/>
                                <select style={{width:"49%"}} className="form-select form-select-md mb-3"  value={role} onChange={(e) => setrole(e.target.value)}>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <input type="password" onChange={(e)=>{setpassword(e.target.value)}} className="form-control col-4 mb-2" placeholder="User Password"/>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={()=>CreateUser()}  type="button" className="btn btn-primary">Create User</button>
                            </div>
                    </div>
                </div>
            </div>
            {/* update modal */}
            <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Update User</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form className="row">
                                <input value={name} type="text" onChange={(e)=>{setname(e.target.value)}} className="form-control col-6 mb-2" placeholder="User Name"/>
                                <input value={email} type="email" onChange={(e)=>{setemail(e.target.value)}} className="form-control col-6 mb-2" placeholder="User Email"/>
                                <input value={phone} type="text" onChange={(e)=>{setphone(e.target.value)}} className="form-control col-4 mb-2" placeholder="User Phone"/>
                                <select style={{width:"49%"}} className="form-select form-select-md mb-3"  value={role} onChange={(e) => setrole(e.target.value)}>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <input value={password} type="password" onChange={(e)=>{setpassword(e.target.value)}} className="form-control col-4 mb-2" placeholder="User Password"/>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={UpdateUser}  type="button" className="btn btn-primary">Update User</button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
        </>
    )
}

export default UserControl;
