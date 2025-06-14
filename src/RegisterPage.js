import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const userType = new URLSearchParams(location.search).get('type') || 'user';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 实际项目中这里应该调用注册API
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   body: JSON.stringify({ ...formData, userType }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      setSuccess('注册成功，即将跳转到登录页...');
      
      // 2秒后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>{userType === 'staff' ? '工作人员注册' : '用户注册'}</h1>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <RegisterForm 
        userType={userType} 
        onRegister={handleRegister} 
        loading={loading}
        success={success}
      />
    </div>
  );
};

export default RegisterPage;  