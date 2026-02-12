import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Alert from "../Components/Common/Alert";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alertMsg, setAlertMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.emailOrPhone.trim()) errs.emailOrPhone = "Email or phone is required";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);
  setAlertMsg(null);

  if (Object.keys(validationErrors).length !== 0) return;

  const result = await login(form.emailOrPhone, form.password);

  if (result.success) {
    setAlertMsg({ success: true, message: "Login successful! Redirecting..." });

    setTimeout(() => {
      navigate("/"); // ✅ USER ONLY
    }, 2000);
  } else {
    setAlertMsg({
      success: false,
      message: result.message || "User not found",
    });
  }
};



  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {alertMsg && (
          <Alert
            type={alertMsg.success ? "success" : "error"}
            message={alertMsg.message}
            onClose={() => setAlertMsg(null)}
          />
        )}

        <div className="form-group">
          <label>Email or Phone</label>
          <input
            type="text"
            name="emailOrPhone"
            value={form.emailOrPhone}
            onChange={handleChange}
            placeholder="Enter email or phone"
          />
          {errors.emailOrPhone && <span className="error">{errors.emailOrPhone}</span>}
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn">Login</button>
        <p className="switch-link">
           <Link to="/forgot-password" style={{ color: "blue" }}>Forgot Password?</Link>
       </p>

        <p className="switch-link">
          Don't have an account? <Link to="/signup">Signup here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
