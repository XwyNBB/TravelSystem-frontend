import { useNavigate } from 'react-router-dom';
// useNavigate 是 React Router v6 中引入的一个钩子函数，用于在 React 组件内部实现编程式导航。
const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <button  onClick={() => navigate('/login')}>登录</button>
  );
};

export default LoginButton;