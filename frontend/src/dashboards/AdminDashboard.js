import AddComp from "./AddCompComponent";
import "./AdminDashboard.css";
import DashComponent from "./DashComponent";

function AdminDashboard({ setPage, setComputerId, userId, isAdmin }) {

  let content = (
    <div className="AdminDashboard">
      <DashComponent setPage={setPage} setComputerId={setComputerId} userId={userId} isAdmin={isAdmin}/>
      <button onClick={() => setPage("ChangePasswordForm")}>
        Go to Change Password
      </button>
      <AddComp userId={userId} />
      <DashComponent setPage={setPage} setComputerId={setComputerId} userId={userId} isAdmin={isAdmin}/>
    </div>
  );
  return content;
}

export default AdminDashboard;
