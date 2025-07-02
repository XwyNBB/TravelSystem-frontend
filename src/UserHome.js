import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';
import OrderFilter from './OrderFilter'; 
import { AuthContext } from './AuthContext';
import axios from 'axios';

const UserHome = ({ account }) => {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 处理搜索表单提交
  const handleSearch = (departure, destination) => {
    // 导航到行程列表页并带上搜索参数
    navigate(`/plan-list?departure=${departure}&destination=${destination}`);
  };

  // 从后端获取所有订单
  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
       const response = await axios.post('/api/orders', {
        
        account} ); 
      // 后端返回的订单数据格式为 {status == '' ,orders: [...] }
      if (response.data.status !== 'success') {
        throw new Error('获取订单失败');
      } 
      // // 模拟API请求延迟
      // await new Promise(resolve => setTimeout(resolve, 800));
      
      // // 模拟返回的订单数据
      // const mockOrders = [
      //   { id: 'ORD001', date: '2025-06-15', amount: 599, status: 'unpaid' },
      //   { id: 'ORD002', date: '2025-06-10', amount: 1299, status: 'unused' },
      //   { id: 'ORD003', date: '2025-05-28', amount: 899, status: 'completed' },
      //   { id: 'ORD004', date: '2025-05-20', amount: 399, status: 'cancelled' }
      // ];
      const mockOrders = response.data.orders; // 假设后端返回的订单数据在orders字段中
      
      setAllOrders(mockOrders);
      filterOrders('all');
    } catch (err) {
      setError('获取订单失败，请稍后再试');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 本地筛选订单
  const filterOrders = (status) => {
    setCurrentStatus(status);
    if (status === 'all') {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.status === status));
    }
  };

  // 联系我们
  const handleContact = () => {
    alert('客服热线：400-123-4567');
  };


  // 组件挂载时获取所有订单
  useEffect(() => {
    fetchAllOrders();
  }, [account]);

  // 状态变更时本地筛选，不重复请求
  useEffect(() => {
    filterOrders(currentStatus);
  }, [currentStatus, allOrders]);

  return (
    <div className="user-home container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">欢迎回来，{account}</h1>
      <button onClick={handleLogout}>登出</button>
      <button
        onClick={handleContact} 
        className="px-6 py-2 mr-4 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
        disabled={loading}
      >
        联系我们
      </button>
      
      {/* 搜索表单组件，传入 handleSearch 方法 */}
      <SearchForm 
        onSearch={handleSearch} 
        loading={loading} 
        error={error} 
      />
      
      {/* 订单筛选组件 */}
      <OrderFilter 
        currentStatus={currentStatus} 
        onFilter={filterOrders} 
        loading={loading}
      />
      
      
      {/* 订单列表区域 */}
      <div className="orders-section mt-8">
        <h2 className="text-xl font-semibold mb-4">我的订单</h2>
        {loading && <p className="text-center text-gray-500">加载中...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">暂无该状态的订单</p>
        ) : (
          <div className="order-list">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={`order-item p-4 mb-3 rounded-lg ${
                  order.status === 'unpaid' ? 'border-l-4 border-yellow-500' :
                  order.status === 'unused' ? 'border-l-4 border-blue-500' :
                  order.status === 'completed' ? 'border-l-4 border-green-500' :
                  order.status === 'cancelled' ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">订单号: {order.id}</h3>
                    <p className="text-sm text-gray-500">下单时间: {order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'unused' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''
                  }`}>
                    {order.status === 'unpaid' ? '未支付' :
                    order.status === 'unused' ? '未使用' :
                    order.status === 'completed' ? '已完成' :
                    order.status === 'cancelled' ? '已取消' : ''}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700">订单金额: <span className="font-semibold text-red-600">¥{order.amount}</span></p>
                </div>
                <div className="mt-3 flex justify-end">
                  <button 
                    className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 mr-2"
                    disabled={loading}
                    onClick={() => navigate(`/details-page/${order.id},{state: {order}}`)}
                  >
                    查看详情
                  </button>
                  {order.status === 'unpaid' && (
                    <button 
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                      disabled={loading}
                      onClick={() => navigate(`/paid-page?orderId=${order.id}`)}
                    >
                      去支付
                    </button>
                  )}
                  {order.status === 'completed' && (
                  <button 
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    disabled={loading}
                    onClick={() => navigate(`/comment-page/${order.id},{state: {order}}`)}
                  >
                    add comment
                  </button>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;