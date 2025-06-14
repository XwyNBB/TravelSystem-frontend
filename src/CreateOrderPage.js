import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils'; // 假设存在日期格式化工具函数

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
    numOfPassengers: 1,
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
    
    // 简单表单验证
    if (!formData.passengerName || !formData.passengerPhone) {
      setError('姓名和电话不能为空');
      return;
    }
    
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
      
      // 订单生成成功
      setSuccess('订单生成成功！即将返回我的订单页面...');
      
      // 2秒后返回UserHome页面
      setTimeout(() => {
        navigate('/user-home', { state: { orderCreated: true } });
      }, 2000);
      
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
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        
        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="passengerName" className="block text-gray-700 mb-2">乘客姓名</label>
              <input
                type="text"
                id="passengerName"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="passengerPhone" className="block text-gray-700 mb-2">联系电话</label>
              <input
                type="tel"
                id="passengerPhone"
                name="passengerPhone"
                value={formData.passengerPhone}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="numOfPassengers" className="block text-gray-700 mb-2">乘客数量</label>
              <select
                id="numOfPassengers"
                name="numOfPassengers"
                value={formData.numOfPassengers}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[...Array(10).keys()].map(i => (
                  <option key={i+1} value={i+1}>{i+1} 人</option>
                ))}
              </select>
            </div>
            
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