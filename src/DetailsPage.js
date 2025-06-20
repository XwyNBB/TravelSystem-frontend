import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataType, setDataType] = useState(''); // 'plan' 或 'order'

  // 联系客服
  const handleContact = () => {
    alert('客服热线：400-123-4567');
  };

  // 模拟获取数据
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟根据ID前缀判断数据类型
      const isOrder = id.startsWith('ORD');
      setDataType(isOrder ? 'order' : 'plan');
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟数据
      const mockData = {
        plan: {
          id: 'PLN001',
          title: '北京-上海周末游',
          price: 599,
          days: 2,
          departure: '北京',
          destination: '上海',
          date: '2025-06-20'
        },
        order: {
          id: 'ORD001',
          title: '北京-上海周末游',
          price: 599,
          passengers: 2,
          total: 1198,
          date: '2025-06-15',
          status: 'unpaid'
        }
      };
      
      setData(mockData[dataType]);
    } catch (err) {
      setError('获取详情失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${year}年${month}月${day}日`;
  };

  // 组件挂载时获取数据
  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  // 渲染行程详情
  const renderPlanDetails = () => {
    const { title, price, days, departure, destination, date } = data;
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700"><span className="font-medium">出发地:</span> {departure}</p>
            <p className="text-gray-700"><span className="font-medium">目的地:</span> {destination}</p>
            <p className="text-gray-700"><span className="font-medium">出发日期:</span> {formatDate(date)}</p>
            <p className="text-gray-700"><span className="font-medium">行程天数:</span> {days} 天</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">¥{price}</p>
            <p className="text-gray-500 mt-1">人均价格</p>
          </div>
        </div>
      </div>
    );
  };

  // 渲染订单详情
  const renderOrderDetails = () => {
    const { id, title, price, passengers, total, date, status } = data;
    const statusText = {
      'unpaid': '未支付',
      'paid': '已支付',
      'cancelled': '已取消'
    };
    const statusClass = {
      'unpaid': 'bg-yellow-100 text-yellow-800',
      'paid': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass[status]}`}>
            {statusText[status]}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700"><span className="font-medium">订单号:</span> {id}</p>
            <p className="text-gray-700"><span className="font-medium">下单日期:</span> {formatDate(date)}</p>
            <p className="text-gray-700"><span className="font-medium">乘客数量:</span> {passengers} 人</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">¥{total}</p>
            <p className="text-gray-500 mt-1">订单总价</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || '未找到详情信息'}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">返回</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{dataType === 'plan' ? '行程详情' : '订单详情'}</h1>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded mr-4">返回</button>
        <button onClick={handleContact} className="px-6 py-2 bg-gray-200 rounded">联系我们</button>
      </div>
      
      {dataType === 'plan' ? renderPlanDetails() : renderOrderDetails()}
    </div>
  );
};

export default DetailsPage;