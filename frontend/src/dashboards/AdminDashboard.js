import "./AdminDashboard.css";
import DashComponent from "./DashComponent";

function AdminDashboard({ setPage, setComputerId, userId }) {

  let content = (
    <div className="AdminDashboard">
      <DashComponent setPage={setPage} setComputerId={setComputerId} userId={userId} admin={true}/>
      <button onClick={() => setPage("ChangePasswordForm")}>
        Go to Change Password
      </button>
      <br />
      <button onClick={() => setPage("ChangePasswordForm")}>
        Add new Computers
      </button>
    </div>
  );
  return content;
}

export default AdminDashboard;
