export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Welcome {user?.name}</p>
      <p>You are logged in 🎉</p>
    </div>
  );
}
