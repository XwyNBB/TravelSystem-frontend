import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin, loading }) => {
  const [userType, setUserType] = useState('user');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 简单表单验证
    if (!account || !password) {
      alert('请输入账号和密码');
      return;
    }
    
    // 调用父组件的登录处理函数
    onLogin(userType, { account, password });
  };

  const handleRegister = () => {
    navigate(`/register?type=${userType}`);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>用户类型</label>
        <select 
          value={userType} 
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="user">普通用户</option>
          <option value="staff">工作人员</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>账号</label>
        <input
          type="text"
          placeholder="请输入账号"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>密码</label>
        <input
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="button-group">
        <button 
          type="submit" 
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        <button 
          type="button" 
          onClick={handleRegister}
          disabled={loading || userType === 'staff'}
        >
          注册 (仅用户)
        </button>
      </div>
    </form>
  );
};

export default LoginForm;  