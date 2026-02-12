// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './Admin.css'
// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:8080/api/admin/check", {
//       method: "GET",
//       headers: {
//         Authorization: "Basic " + btoa(email + ":" + password)
//       },
//       credentials: "include"
//     });

//     if (res.ok) {
//       navigate("/admin/dashboard");
//     } else {
//       alert("Invalid admin credentials");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <h2>Admin Login</h2>

//       <input
//         type="email"
//         placeholder="Admin Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />

//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default AdminLogin;
