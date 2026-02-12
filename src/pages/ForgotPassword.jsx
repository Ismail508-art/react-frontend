import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../Components/Common/Alert";
import "./Login.css"; // reuse login card styling

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setAlertMsg({ success: false, message: "Please enter your email" });
      return;
    }

    try {
      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }
);

      const text = await res.text();

      if (res.ok) {
        setAlertMsg({ success: true, message: text });
        // redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setAlertMsg({ success: false, message: text });
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({ success: false, message: "Something went wrong. Try again." });
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        {alertMsg && (
          <Alert
            type={alertMsg.success ? "success" : "error"}
            message={alertMsg.message}
            onClose={() => setAlertMsg(null)}
          />
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
