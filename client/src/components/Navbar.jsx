// import { AppBar, Toolbar, Button } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { isLoggedIn, logout } from "../utils/auth";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <AppBar position="static">
//       <Toolbar>
//         {!isLoggedIn() ? (
//           <>
//             <Button color="inherit" component={Link} to="/">Login</Button>
//             <Button color="inherit" component={Link} to="/register">Register</Button>
//           </>
//         ) : (
//           <>
//             <Button color="inherit" component={Link} to="/dashboard">
//               Dashboard
//             </Button>
//             <Button color="inherit" onClick={handleLogout}>
//               Logout
//             </Button>
//           </>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// }
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <h3>MERN Blog</h3>
      <div>
        {!token ? (
          <>
            <Link to="/blogs">Blogs</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/posts">Posts</Link>
            <button className="w-0" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
