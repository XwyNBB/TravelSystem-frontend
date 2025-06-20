// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <div className="App-logo">
      </div>
      
      <div className="app-content">
        <h1>欢迎使用旅游行程管理系统</h1>
        <p>轻松规划、管理你的每一次旅行，让旅程更精彩</p>
        <button onClick={() => navigate('/login')}>
          login to use
        </button>
      </div>
    </div>
  );
}

export default HomePage;