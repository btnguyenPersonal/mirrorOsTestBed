import AddComp from "./AddCompComponent";
import "./AdminDashboard.css";
import DashComponent from "./DashComponent";

function AdminDashboard({ setPage, setComputerId, userId }) {

  let content = (
    <div className="AdminDashboard">
      <DashComponent setPage={setPage} setComputerId={setComputerId} userId={userId} isAdmin={true}/>
      <button onClick={() => setPage("ChangePasswordForm")}>
        Go to Change Password
      </button>
      <AddComp userId={userId} />
    </div>
  );
  return content;
}

export default AdminDashboard;
