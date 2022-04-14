import "./AdminDashboard.css";
import DashComponent from "./DashComponent";

function AdminDashboard({ setPage, setComputerId, userId }) {

  let content = (
    <div className="AdminDashboard">
      <DashComponent setPage={setPage} setComputerId={setComputerId} userId={userId} admin={true}/>
    </div>
  );
  return content;
}

export default AdminDashboard;
