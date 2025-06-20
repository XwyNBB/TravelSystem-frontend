// Routes.js
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import UserHome from './UserHome'; 
import StaffHome from './StaffHome';
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import PlanList from './PlanList';
import CreateOrderPage from './CreateOrderPage'; 
import PaidPage from './PaidPage';
import Commentpage from './CommentPage';
import DetailsPage from './DetailsPage'; 
import PlanManagement from './PlanManagement';
import OrderManagement from './OrderManagement';
import CommentManagement from './CommentManagement';  


const AppRouter = () => {
  const { account } = useContext(AuthContext); 
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-home" element={<UserHome account={account} />} />  
      <Route path="/staff-home" element={<StaffHome />} />
      <Route path="/plan-list" element={<PlanList />} />
      <Route path="/order-generate" element={<CreateOrderPage />} />
      <Route path="/paid-page" element={<PaidPage />} />
      <Route path="/comment-page/:id" element={<Commentpage />} />
      <Route path="/details-page/:id" element={<DetailsPage />} />
        <Route path="/plan-management/:id" element={<PlanManagement />} />
      <Route path="/order-management/:id" element={<OrderManagement />} />  
        <Route path="/comment-management/:id" element={<CommentManagement />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRouter;