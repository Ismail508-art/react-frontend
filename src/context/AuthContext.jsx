import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// ✅ Production-safe API URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const text = await res.text();
      if (!res.ok) return { success: false, message: text };

      return { success: true, message: text };
    } catch {
      return { success: false, message: "Server error" };
    }
  };

  const login = async (emailOrPhone, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });

      if (!res.ok) {
        return { success: false, message: "Invalid credentials" };
      }

      const data = await res.json();

      // ✅ Normalize backend response
      const normalizedUser = {
        ...data,
        isAdmin: data.admin,
      };

      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      return { success: true, user: normalizedUser };
    } catch {
      return { success: false, message: "Server error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const canBookAppointment = () => user !== null;

  const getAppointmentUserDetails = () => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        canBookAppointment,
        getAppointmentUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
