import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlanFilter from './PlanFilter';
import axios from 'axios';

const PlanList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('price-asc');
  
  // 从URL参数中获取搜索条件
  const queryParams = new URLSearchParams(location.search);
  const departure = queryParams.get('departure') || '';
  const destination = queryParams.get('destination') || '';

  const fetchPlans = async () => {
    setLoading(true);
    setError('');

    try {
      // // const response = await axios.post('/api/Orders/search', {
      // //   departure,
      // //   destination 
      // });
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟返回的行程数据
      const mockPlans = [
        { 
          id: 'PLN001', title: '北京-上海周末游', price: 599, days: 2,
          departureDate: '2025-06-20', returnDate: '2025-06-22', orderCount: 128,
          accommodation: '三星酒店', transportation: '高铁往返', includedServices: '早餐, 导游服务',
          departure: '北京', destination: '上海'
        },
        { 
          id: 'PLN002', title: '广州-深圳一日游', price: 299, days: 1,
          departureDate: '2025-06-18', returnDate: '2025-06-18', orderCount: 256,
          accommodation: '无', transportation: '旅游大巴', includedServices: '午餐, 景点门票',
           departure: '北京', destination: '上海'
        },
        { 
          id: 'PLN003', title: '北京-杭州四日游', price: 1299, days: 4,
          departureDate: '2025-06-25', returnDate: '2025-06-28', orderCount: 89,
          accommodation: '四星酒店', transportation: '飞机往返', includedServices: '早餐, 导游服务, 景点门票',
          departure: '北京', destination: '杭州'
        }
      ];
      
      // 根据URL参数筛选行程
      const filteredPlans = mockPlans.filter(plan => {
        const planDeparture = plan.departure.toLowerCase();
        const planDestination = plan.destination.toLowerCase();
        const searchDeparture = departure.toLowerCase();
        const searchDestination = destination.toLowerCase();
        
        return (
          planDeparture.includes(searchDeparture) && 
          planDestination.includes(searchDestination)
        );
      });
      
      setPlans(filteredPlans);
    } catch (err) {
      setError('获取行程列表失败，请稍后再试');
      console.error('Fetch plans error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedPlans = () => {
    if (!plans || plans.length === 0) return [];
    
    return [...plans].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'days-asc': return a.days - b.days;
        case 'days-desc': return b.days - a.days;
        case 'popularity-desc': return b.orderCount - a.orderCount;
        default: return 0;
      }
    });
  };

  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  const handleGenerateOrder = (planId) => {
    navigate(`/order-generate?planId=${planId}`);
  };

  // 当URL参数变化时重新获取数据
  useEffect(() => {
    if (departure || destination) {
      fetchPlans();
    } else {
      // 如果没有搜索参数，返回首页
      navigate('/user-home');
    }
  }, [departure, destination, navigate]);

  return (
    <div className="plan-list container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">行程列表</h1>
          <div className="search-summary mt-2 text-gray-600">
            <p>搜索结果：从 {departure || '任意地点'} 到 {destination || '任意地点'}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            返回
          </button>
        </div>
      </div>
      
      {/* 使用 PlanFilter 组件 */}
      <PlanFilter 
        sortOption={sortOption} 
        onSortChange={setSortOption} 
      />
      
      {loading && <p className="text-center text-gray-500 py-8">加载中...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      
      {plans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">没有找到匹配的行程</p>
          <p className="text-gray-400 mt-2">请尝试调整搜索条件</p>
        </div>
      ) : (
        <div className="plans-list space-y-4">
          {sortedPlans().map((plan) => (
            <div 
              key={plan.id} 
              className="plan-item p-5 border border-gray-200 rounded-lg mb-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="md:w-2/3 mb-4 md:mb-0 md:pr-6">
                  <h3 className="font-semibold text-lg mb-2">{plan.title}</h3>
                  
                  <div className="plan-info grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-700 mb-1"><span className="font-medium text-gray-900">出发日期:</span> {plan.departureDate}</p>
                      <p className="text-gray-700 mb-1"><span className="font-medium text-gray-900">返回日期:</span> {plan.returnDate}</p>
                      <p className="text-gray-700 mb-1"><span className="font-medium text-gray-900">行程天数:</span> {plan.days} 天</p>
                      <p className="text-gray-700"><span className="font-medium text-gray-900">住宿:</span> {plan.accommodation}</p>
                    </div>
                    <div>
                      <p className="text-gray-700 mb-1"><span className="font-medium text-gray-900">交通:</span> {plan.transportation}</p>
                      <p className="text-gray-700 mb-1"><span className="font-medium text-gray-900">包含服务:</span> {plan.includedServices}</p>
                      <p className="text-gray-700 mb-1"><span className="font-medium text-gray-900">热门程度:</span> <span className="text-blue-600 font-semibold">{plan.orderCount} 人已订购</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3 flex flex-col items-end">
                  <p className="text-red-600 font-bold text-2xl mb-2">¥{plan.price}</p>
                  <button
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                    onClick={() => handleGenerateOrder(plan.id)}
                  >
                    生成订单
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanList;