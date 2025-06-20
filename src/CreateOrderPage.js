import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${year}年${month}月${day}日`;
};


const CreateOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planId, setPlanId] = useState('');
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerPhone: '',
    specialRequests: ''
  });

  // 从URL获取行程ID
  const searchParams = new URLSearchParams(location.search);
  const planIdFromUrl = searchParams.get('planId');

  // 模拟从后端获取行程数据
  const fetchPlanData = async (id) => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟行程数据（根据ID获取）
      const mockPlans = {
        'PLN001': { 
          id: 'PLN001', 
          title: '北京-上海周末游', 
          price: 599,
          departure: '北京', 
          destination: '上海',
          departureDate: '2025-06-20',
          returnDate: '2025-06-22',
          days: 2
        },
        'PLN002': { 
          id: 'PLN002', 
          title: '广州-深圳一日游', 
          price: 299,
          departure: '广州', 
          destination: '深圳',
          departureDate: '2025-06-18',
          returnDate: '2025-06-18',
          days: 1
        }
      };
      
      const plan = mockPlans[id];
      if (!plan) throw new Error('行程不存在');
      
      setPlanData(plan);
      setPlanId(id);
    } catch (err) {
      setError('获取行程信息失败，请稍后再试');
      console.error('Fetch plan error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 处理表单变化
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 提交订单
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 模拟订单生成API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟生成的订单数据
      const orderData = {
        orderId: `ORD${Date.now().toString().slice(-8)}`,
        planId,
        passengerInfo: formData,
        orderTime: new Date().toISOString(),
        totalAmount: planData.price * formData.numOfPassengers,
        status: 'unpaid'
      };
      
      setSuccess({
        message: '订单生成成功，正在跳转至支付页面...',
        orderId: orderData.orderId
      });
      
    } catch (err) {
      setError('订单生成失败，请稍后再试');
      console.error('Create order error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取行程数据
  useEffect(() => {
    if (planIdFromUrl) {
      fetchPlanData(planIdFromUrl);
    } else {
      navigate('/plan-list'); // 若无行程ID，重定向到行程列表
    }
  }, [planIdFromUrl, navigate]);

  // 成功提示后自动跳转
  useEffect(() => {
    if (success && success.orderId) {
      const timer = setTimeout(() => {
        navigate(`/paid-page?orderId=${success.orderId}`);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  
  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  if (!planData) {
    return <div className="text-center py-10">{error || '行程信息不存在'}</div>;
  }

  return (
    <div className="create-order-page container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">生成订单</h1>
        <button
          onClick={() => navigate('/plan-list')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          返回列表
        </button>
      </div>
      
      {/* 行程信息预览 */}
      <div className="plan-preview mb-8 p-5 border border-gray-200 rounded-lg">
        <h2 className="font-semibold text-lg mb-3">{planData.title}</h2>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">价格:</span> ¥{planData.price} × {formData.numOfPassengers} 人 = ¥{planData.price * formData.numOfPassengers}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">行程日期:</span> {formatDate(planData.departureDate)} 至 {formatDate(planData.returnDate)} ({planData.days}天)
        </p>
        <p className="text-gray-700">
          <span className="font-medium">行程路线:</span> {planData.departure} → {planData.destination}
        </p>
      </div>
      
      {/* 订单表单 */}
      <div className="order-form max-w-lg mx-auto">
        <h2 className="font-semibold text-lg mb-4">乘客信息</h2>
        {/* 根据account请求后端，获取userinfo，显示在这儿 */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
  <div className="success-message">
    <p className="text-2xl font-semibold text-green-600 mb-4">
      {success.message}
      {success.orderId && (
        <a
          href={`/paid-page?orderId=${success.orderId}`}
          className="text-blue-600 ml-2 hover:underline"
        >
          点击立即支付
        </a>
      )}
    </p>
  </div>
)}
        {!success && (
          <form onSubmit={handleSubmit}> 
            <div className="mb-6">
              <label htmlFor="specialRequests" className="block text-gray-700 mb-2">特殊需求 (选填)</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleFormChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="如饮食禁忌、座位偏好等"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
              disabled={loading || success}
            >
              {loading ? '生成中...' : '确认生成订单'}
            </button>
          </form>
        )}
      </div>
    </div>  
  );
};

export default CreateOrderPage;