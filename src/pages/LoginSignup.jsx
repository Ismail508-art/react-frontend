import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./LoginSignup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Alert from "../Components/Common/Alert";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alertMsg, setAlertMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};

    // Name validation
    if (!form.name.trim()) {
      errs.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      errs.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email";
    }

    // Phone validation
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^[1-9][0-9]{9}$/.test(form.phone)) {
      // First digit 1-9, followed by exactly 9 digits
      errs.phone = "Enter a valid 10-digit phone number starting from 1-9";
    }

    // Password validation
    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();
  setErrors(validationErrors);
  setAlertMsg(null);

  if (Object.keys(validationErrors).length === 0) {
    const result = await signup(form);   // ✅ FIX: await added
    setAlertMsg(result);

    if (result?.success) {
      setForm({ name: "", email: "", phone: "", password: "" });
    }
  }
};

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        {alertMsg && (
          <Alert
            type={alertMsg.success ? "success" : "error"}
            message={alertMsg.message}
            onClose={() => setAlertMsg(null)}
          />
        )}

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
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

        <button type="submit" className="submit-btn">Signup</button>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
