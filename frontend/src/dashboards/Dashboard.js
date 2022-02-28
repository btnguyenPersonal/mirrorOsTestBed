import "./Dashboard.css";

function Dashboard({ setPage }) {
  const list = [
    {
      id: "1",
      piType: "3b+",
      available: true,
    },
    {
      id: "2",
      piType: "4",
      available: false,
    },
    {
      id: "3",
      piType: "3b+",
      available: false,
    },
  ];

  function onBtnClick(id,available){
    console.log(id);
    if(available)
        setPage("Terminal");
    else
        return;
  }

  let content = (
<nav>
    <div className="Header">Welcome</div>
    <ul>
      {list.map((item) => (
        <li key={item.id}>
          <button onClick={() => onBtnClick(item.id,item.available)}>
            Pi Number: {item.id} Pi Type: {item.piType}
          </button>
          <div>Pi availability: {String(item.available)}</div>
        </li>
      ))}
    </ul>
    </nav>
  );

  return content;
}

export default Dashboard;
