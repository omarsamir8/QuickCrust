"use client";
import { createContext, useContext, useEffect, useState } from "react";

// إنشاء السياق
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ استرجاع بيانات المستخدم من localStorage عند تحميل الصفحة
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ تسجيل الدخول وحفظ البيانات في localStorage
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ تسجيل الخروج وحذف البيانات من localStorage
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ هوك لاستخدام السياق بسهولة
export function useAuth() {
  return useContext(AuthContext);
}
