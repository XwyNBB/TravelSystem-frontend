// AuthContext.js - 完善AuthContext实现
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!account);

  // 登录函数
  const login = (newAccount, newToken) => {
    localStorage.setItem('account', newAccount);
    localStorage.setItem('token', newToken);
    setAccount(newAccount);
    setToken(newToken);
    setIsAuthenticated(true);
    
    // 设置axios默认请求头
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // 退出登录函数
  const logout = () => {
    localStorage.removeItem('account');
    localStorage.removeItem('token');
    setAccount(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // 清除axios请求头
    delete axios.defaults.headers.common['Authorization'];
  };

  // 初始化时设置请求头
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ account, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};