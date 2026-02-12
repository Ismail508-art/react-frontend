import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Alert from "../Components/Common/Alert";
import "./Login.css"; // reuse login card styling

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alertMsg, setAlertMsg] = useState(null);

  // ✅ Validation
  const validate = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";

    if (!confirmPassword) errs.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setAlertMsg(null);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  }
);


        const text = await res.text();

        if (res.ok) {
          setAlertMsg({ success: true, message: text });
          // redirect after 2s
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setAlertMsg({ success: false, message: text });
        }
      } catch (err) {
        console.error(err);
        setAlertMsg({ success: false, message: "Something went wrong" });
      }
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Invalid Reset Link</h2>
          <p>The reset password link is invalid or missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {alertMsg && (
          <Alert
            type={alertMsg.success ? "success" : "error"}
            message={alertMsg.message}
            onClose={() => setAlertMsg(null)}
          />
        )}

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="submit-btn">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
