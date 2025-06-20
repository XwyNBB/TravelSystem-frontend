import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const RegisterForm = ({ onRegister, loading, success }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    realName: '',
    age: '',
    gender: '', 
    phone: '',
    email: '',
    account: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.account || !formData.password) {
      alert('用户名和密码不能为空');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    // 调用父组件的注册处理函数
    onRegister({
      ...formData, 
    });
  };

  return (
    <form onSubmit={handleSubmit} disabled={loading || !!success}>
      <div className="form-group">
  <label>真实姓名</label>
  <input
    type="text"
    name="realName"
    placeholder="请输入真实姓名"
    value={formData.realName}
    onChange={handleChange}
    disabled={loading || !!success}
  />
</div>

<div className="form-group">
  <label>年龄</label>
  <input
    type="number"
    name="age"
    placeholder="请输入年龄"
    value={formData.age}
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
  <label>用户名</label>
  <input
    type="text"
    name="account"
    placeholder="请输入用户名"
    value={formData.account}
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
      
<div className="button-group">
        {/* 修复按钮渲染问题 */}
        <button 
          type="submit" 
          disabled={loading || !!success}
        >
          注册
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/login')}
          disabled={loading || !!success}
        >
          已有账号，返回登录
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;

      