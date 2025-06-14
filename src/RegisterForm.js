import React, { useState } from 'react';

const RegisterForm = ({ onRegister, loading, success }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    gender: 'male', // 默认性别为男
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.username || !formData.password) {
      alert('用户名和密码不能为空');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    if (!formData.phone) {
      alert('请输入电话号码');
      return;
    }
    
    // 提交表单数据（固定用户类型为user）
    onRegister({
      ...formData,
      userType: 'user'
    });
  };

  return (
    <form onSubmit={handleSubmit} disabled={loading || !!success}>
      <div className="form-group">
        <label>用户名</label>
        <input
          type="text"
          name="username"
          placeholder="请输入用户名"
          value={formData.username}
          onChange={handleChange}
          disabled={loading || !!success}
        />
      </div>
      
      <div className="form-group">
        <label>邮箱</label>
        <input
          type="email"
          name="email"
          placeholder="请输入邮箱"
          value={formData.email}
          onChange={handleChange}
          disabled={loading || !!success}
        />
      </div>
      
      <div className="form-group">
        <label>密码</label>
        <input
          type="password"
          name="password"
          placeholder="请输入密码"
          value={formData.password}
          onChange={handleChange}
          disabled={loading || !!success}
        />
      </div>
      
      <div className="form-group">
        <label>确认密码</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="请再次输入密码"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading || !!success}
        />
      </div>
      
      <div className="form-group">
        <label>性别</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
              disabled={loading || !!success}
            />
            男
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
              disabled={loading || !!success}
            />
            女
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === 'other'}
              onChange={handleChange}
              disabled={loading || !!success}
            />
            其他
          </label>
        </div>
      </div>
      
      <div className="form-group">
        <label>电话</label>
        <input
          type="tel"
          name="phone"
          placeholder="请输入电话号码"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading || !!success}
        />
      </div>
      
      <div className="button-group">
        <button 
          type="submit" 
          disabled={loading || !!success}
        >
          {loading ? '注册中...' : '注册'}
        </button>
        <button 
          type="button" 
          onClick={() => window.history.back()}
          disabled={loading || !!success}
        >
          返回登录
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;  