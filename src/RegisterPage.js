import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/register', {
        params: {
          ...formData // 包含账号、密码等注册信息
        }
      });
      // 后端返回格式需要是 { status: 'success' } 
      if(response.data.status !== 'success') {
        throw new Error('注册失败，请重试');
      } 
      else{
      setSuccess('注册成功，即将跳转到登录页...');
      
      // 2秒后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } 
    } catch (err) {
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>用户注册</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <RegisterForm 
        onRegister={handleRegister} 
        loading={loading}
        success={success}
      />
    </div>
  );
};

export default RegisterPage;  