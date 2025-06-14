import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';
import OrderFilter from './OrderFilter';
import Others from './Others';

const UserHome = ({ account }) => {
  const [orders, setOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 模拟从后端获取订单数据
  const fetchOrders = async (status = 'all') => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟订单数据
      const mockOrders = [
        { id: 'ORD001', status: 'unpaid', amount: 299, date: '2025-06-10' },
        { id: 'ORD002', status: 'unused', amount: 159, date: '2025-06-12' },
        { id: 'ORD003', status: 'completed', amount: 459, date: '2025-06-05' },
        { id: 'ORD004', status: 'cancelled', amount: 199, date: '2025-06-01' }
      ];
      
      // 根据状态筛选订单
      const filteredOrders = status === 'all' 
        ? mockOrders 
        : mockOrders.filter(order => order.status === status);
      
      setOrders(filteredOrders);
    } catch (err) {
      setError('获取订单失败，请稍后再试');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 联系我们
  const handleContact = () => {
    alert('客服热线：400-123-4567');
  };

  // 我的评论
  const handleComment = () => {
    navigate('/comments'); // 跳转到评论页面
  };

  // 组件挂载时获取订单
  useEffect(() => {
    fetchOrders();
  }, []);

  // 订单状态变更时重新获取订单
  useEffect(() => {
    fetchOrders(currentStatus);
  }, [currentStatus]);

  return (
    <div className="user-home container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">欢迎回来，{account}</h1>
      
      {/* 搜索表单组件（修改后直接跳转） */}
      <SearchForm loading={loading} error={error} />
      
      {/* 订单筛选组件 */}
      <OrderFilter 
        currentStatus={currentStatus} 
        onFilter={setCurrentStatus} 
        loading={loading}
      />
      
      {/* 其他功能组件 */}
      <Others 
        onContact={handleContact} 
        onComment={handleComment} 
        loading={loading}
      />
      
      {/* 订单列表区域 */}
      <div className="orders-section mt-8">
        <h2 className="text-xl font-semibold mb-4">我的订单</h2>
        {loading && <p className="text-center text-gray-500">加载中...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">暂无订单</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
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
                    onClick={() => navigate(`/order-detail/${order.id}`)} // 跳转到订单详情页
                  >
                    查看详情
                  </button>
                  {order.status === 'unpaid' && (
                    <button 
                      className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                      disabled={loading}
                      onClick={() => navigate('/payment')} // 跳转到支付页
                    >
                      去支付
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