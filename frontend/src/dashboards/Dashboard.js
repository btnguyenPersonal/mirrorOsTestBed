import Button from "react-bootstrap/Button";
import "./Dashboard.css";

function Dashboard({ setPage }) {



    let content = (
        <div className="Dashboard"> 
           <Button onClick={() => setPage("Terminal")}>Terminal Button</Button>
        </div>
    );
    return content;
}

export default Dashboard;