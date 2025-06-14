import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [userType, setUserType] = useState('user');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // API 基础 URL
    const USER_API_URL = 'http://localhost:userInfo/api';

    const handleLogin = async () => {
        // 表单验证
        if (!account || !password) {
            setError('请输入账号和密码');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // 发送登录请求到后端
            const response = await axios.post(
                `${USER_API_URL}/auth/login`,
                {
                    userType,
                    account,
                    password
                }
            );
            
            // 登录成功，保存token和用户信息
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setSuccess('登录成功！即将跳转...');
            
            // 延迟1秒后重定向
            setTimeout(() => {
                if (userType === 'user') {
                    window.location.href = '/user';
                } else {
                    window.location.href = '/staff';
                }
            }, 1000);
            
        } catch (err) {
            // 处理登录失败
            if (err.response) {
                setError(err.response.data.message || '登录失败，请检查账号密码');
            } else {
                setError('服务器连接失败，请稍后再试');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        // 表单验证
        if (!account || !password) {
            setError('请输入账号和密码');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // 发送注册请求到后端
            await axios.post(
                `${USER_API_URL}/auth/register`,
                {
                    userType: 'user', // 注册只能是普通用户
                    account,
                    password
                }
            );
            
            setSuccess('注册成功，请登录');
            
            // 清空输入框
            setAccount('');
            setPassword('');
            
        } catch (err) {
            // 处理注册失败
            if (err.response) {
                setError(err.response.data.message || '注册失败，请重试');
            } else {
                setError('服务器连接失败，请稍后再试');
            }
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <h1>用户登录</h1>
            
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
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
                    onClick={handleLogin} 
                    disabled={loading}
                    className="login-button"
                >
                    {loading ? '登录中...' : '登录'}
                </button>
                <button 
                    onClick={handleRegister} 
                    disabled={loading || userType === 'staff'}
                    className="register-button"
                >
                    {loading ? '处理中...' : '注册 (仅用户)'}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
