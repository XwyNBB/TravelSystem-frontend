import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PlanList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [sortedPlans, setSortedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('price-asc'); // 默认按价格升序排序
  
  // 排序选项
  const sortOptions = [
    { value: 'price-asc', label: '价格从低到高' },
    { value: 'price-desc', label: '价格从高到低' },
    { value: 'days-asc', label: '行程天数从少到多' },
    { value: 'days-desc', label: '行程天数从多到少' },
    { value: 'popularity-desc', label: '热门程度' }
  ];

  // 从URL获取搜索参数
  const searchParams = new URLSearchParams(location.search);
  const departure = searchParams.get('departure') || '';
  const destination = searchParams.get('destination') || '';

  // 模拟从后端获取行程数据（包含订单数用于热门程度排序）
  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟行程数据（包含订单数）
      const mockPlans = [
        { 
          id: 'PLN001', 
          title: '北京-上海周末游', 
          departure: '北京', 
          destination: '上海', 
          price: 599, 
          days: 2,
          departureDate: '2025-06-20',
          returnDate: '2025-06-22',
          orderCount: 128, // 订单数，用于热门程度排序
          accommodation: '三星酒店',
          transportation: '高铁往返',
          includedServices: '早餐, 导游服务'
        },
        { 
          id: 'PLN002', 
          title: '广州-深圳一日游', 
          departure: '广州', 
          destination: '深圳', 
          price: 299, 
          days: 1,
          departureDate: '2025-06-18',
          returnDate: '2025-06-18',
          orderCount: 256, // 订单数，用于热门程度排序
          accommodation: '无',
          transportation: '旅游大巴',
          includedServices: '午餐, 景点门票'
        },
        { 
          id: 'PLN003', 
          title: '上海-杭州三日游', 
          departure: '上海', 
          destination: '杭州', 
          price: 799, 
          days: 3,
          departureDate: '2025-06-25',
          returnDate: '2025-06-28',
          orderCount: 89, // 订单数，用于热门程度排序
          accommodation: '四星酒店',
          transportation: '动车往返',
          includedServices: '早餐, 午餐, 导游服务, 景点门票'
        },
        { 
          id: 'PLN004', 
          title: '北京-天津一日游', 
          departure: '北京', 
          destination: '天津', 
          price: 199, 
          days: 1,
          departureDate: '2025-06-19',
          returnDate: '2025-06-19',
          orderCount: 187, // 订单数，用于热门程度排序
          accommodation: '无',
          transportation: '城际列车',
          includedServices: '导游服务, 景点门票'
        }
      ];
      
      // 根据搜索参数筛选行程
      const filteredPlans = departure && destination 
        ? mockPlans.filter(
            plan => 
              plan.departure.includes(departure) && 
              plan.destination.includes(destination)
          )
        : mockPlans;
      
      setPlans(filteredPlans);
      setSortedPlans(filteredPlans);
    } catch (err) {
      setError('获取行程列表失败，请稍后再试');
      console.error('Fetch plans error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 排序行程
  useEffect(() => {
    if (plans.length === 0) return;
    
    let sorted = [...plans];
    
    switch (sortOption) {
      case 'price-asc':
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted = sorted.sort((a, b) => b.price - a.price);
        break;
      case 'days-asc':
        sorted = sorted.sort((a, b) => a.days - b.days);
        break;
      case 'days-desc':
        sorted = sorted.sort((a, b) => b.days - a.days);
        break;
      case 'popularity-desc':
        sorted = sorted.sort((a, b) => b.orderCount - a.orderCount);
        break;
      default:
        sorted = [...plans];
    }
    
    setSortedPlans(sorted);
  }, [plans, sortOption]);

  // 返回用户主页
  const handleBack = () => {
    navigate('/user-home');
  };

  // 生成订单
  const handleGenerateOrder = (planId) => {
    navigate(`/order-generate?planId=${planId}`);
  };

  // 组件挂载时获取行程
  useEffect(() => {
    if (departure && destination) {
      fetchPlans();
    } else {
      navigate('/user-home');
    }
  }, [departure, destination, navigate]);

  return (
    <div className="plan-list container mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">行程列表</h1>
          <div className="search-summary mt-2">
            <p>搜索结果：从 {departure} 到 {destination}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
      
      {/* 排序按钮 */}
      <div className="sort-buttons mb-6 flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSortOption(option.value)}
            className={`px-4 py-2 rounded-md ${
              sortOption === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {loading && <p className="text-center text-gray-500">加载中...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {sortedPlans.length === 0 ? (
        <p className="text-center text-gray-500">没有找到匹配的行程</p>
      ) : (
        <div className="plans-list">
          {sortedPlans.map((plan) => (
            <div 
              key={plan.id} 
              className="plan-item p-5 border border-gray-200 rounded-lg mb-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-3">{plan.title}</h3>
              
              {/* 行程信息展示（逗号分隔） */}
              <div className="plan-info mb-4">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">出发日期:</span> {plan.departureDate}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">返回日期:</span> {plan.returnDate}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">行程天数:</span> {plan.days} 天
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">住宿:</span> {plan.accommodation}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">交通:</span> {plan.transportation}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">包含服务:</span> {plan.includedServices}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-red-600 font-bold text-xl">¥{plan.price}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    热门程度: <span className="font-medium">{plan.orderCount} 人已订购</span>
                  </p>
                </div>
                <button
                  className="mt-3 md:mt-0 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => handleGenerateOrder(plan.id)}
                >
                  生成订单
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanList;