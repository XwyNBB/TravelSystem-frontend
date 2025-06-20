import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; // 引入AuthContext

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 使用AuthContext中的login函数
  const { login } = useContext(AuthContext);

  const handleLogin = async (userType, credentials) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 测试用户直接登录
      if (userType === 'test-user' || userType === 'test-staff') {
        // 使用login函数设置account
        login(credentials.account, 'test-token');
        
        if (userType === 'test-staff') {
          navigate('/staff-home');
        } else {
          navigate('/user-home');
        }
        return;
      }

      // 实际登录请求
      const response = await axios.post('/api/login', {
        userType,
        ...credentials
      });
      
      const { status, role, token } = response.data;
      
      if (status !== 'success') {
        throw new Error('登录失败，请检查您的凭证');
      }
      
      // 使用login函数设置account和token
      login(credentials.account, token);
      
      if (role === 'staff') {
        navigate('/staff-home');
      } else {
        navigate('/user-home');
      }
      
      setSuccess('登录成功！');
      
    } catch (err) {
      setError('登录失败，请检查您的凭证或稍后再试');
      console.error('登录错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 从localStorage获取account（如果已经登录）
  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      navigate('/user-home');
    }
  }, [navigate]);

  return (
    <div className="login-page-container">
      <h1>系统登录</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <LoginForm onLogin={handleLogin} loading={loading} />
    </div>
  );
};

export default LoginPage;