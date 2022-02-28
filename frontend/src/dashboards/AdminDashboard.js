import Button from "react-bootstrap/Button";
import "./AdminDashboard.css";
import ChartistGraph from "react-chartist";

function AdminDashboard({ setPage }) {

  let content = (
    <div className="AdminDashboard">
      <Button onClick={() => setPage("Terminal")}>Admin Terminal Button</Button>
    </div>
  );
  return content;
}

export default AdminDashboard;
