import DashboardNav from "./layout";
export const metadata = {
    title: "QuickCrust Dashboard",
    description: "Admin Thing Admin Can Control It And Make Chane Of it",
  };
  
 function Dashboard(){
   
    return(
        <>
            <div>
                <DashboardNav/>
            </div>
        </>
    )
}
export default Dashboard;