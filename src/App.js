import React, { useState } from 'react';
import LoginPage from './LoginPage';
import UserPage from './UserPage';
import StaffPage from './StaffPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const [account, setAccount] = useState('');

    const handleLogin = (type, account, password) => {
      //check 登录逻辑
        setIsLoggedIn(true);
        setUserType(type);
        setAccount(account);
    };

    return (
        <div className="App">
            {!isLoggedIn ? (
                <LoginPage onLogin={handleLogin} /> // 将函数作为 props 传递
            ) : userType === 'user' ? (
                <UserPage account={account}/>
            ) : (
                <StaffPage account={account} />
            )}
        </div>
    );
}

export default App;