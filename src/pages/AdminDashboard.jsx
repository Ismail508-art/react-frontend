import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  // ✅ GET ADMIN FROM LOCALSTORAGE
  const admin = JSON.parse(localStorage.getItem("admin"));

  // 🔐 ADMIN GUARD
  useEffect(() => {
    if (!admin || !admin.admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  // ⛔ STOP RENDER IF NOT ADMIN
  if (!admin || !admin.admin) {
    return null;
  }

  // 📥 FETCH APPOINTMENTS
  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/appointments`)
    .then((res) => {
      if (!res.ok) throw new Error("Forbidden");
      return res.json();
    })
    .then((data) => setAppointments(data))
    .catch((err) => console.error("Appointments error:", err));
}, []);


  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Time</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td>{a.contact}</td>
                <td>{a.treatment}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
