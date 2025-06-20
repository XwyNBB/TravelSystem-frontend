import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PlanManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchId, setSearchId] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetail, setIsDetail] = useState(false);
  const [detailPlan, setDetailPlan] = useState(null);

  // 模拟从后端获取行程数据
  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟行程数据
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
          accommodation: '三星酒店',
          transportation: '高铁往返',
          includedServices: '早餐, 导游服务',
          status: 'active'
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
          accommodation: '无',
          transportation: '旅游大巴',
          includedServices: '午餐, 景点门票',
          status: 'active'
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
          accommodation: '四星酒店',
          transportation: '动车往返',
          includedServices: '早餐, 午餐, 导游服务, 景点门票',
          status: 'inactive'
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
          accommodation: '无',
          transportation: '城际列车',
          includedServices: '导游服务, 景点门票',
          status: 'active'
        }
      ];
      
      setPlans(mockPlans);
    } catch (err) {
      setError('获取行程数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 搜索特定ID的行程
  const handleSearch = () => {
    if (!searchId) {
      setError('请输入行程ID');
      return;
    }
    
    const plan = plans.find(plan => plan.id === searchId);
    if (plan) {
      setDetailPlan(plan);
      setIsDetail(true);
    } else {
      setError(`未找到ID为 ${searchId} 的行程`);
    }
  };

  // 返回列表页
  const handleBackToList = () => {
    setIsDetail(false);
    setDetailPlan(null);
    setSearchId('');
  };

  // 保存修改
  const handleSave = (updatedPlan) => {
    setDetailPlan(updatedPlan);
    setError('行程信息已更新');
    
    // 2秒后清除提示
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  
  // 组件挂载时获取行程数据
  useEffect(() => {
    fetchPlans();
  }, []);

  // ID参数变化时加载详情
  useEffect(() => {
    if (id) {
      setSearchId(id);
      handleSearch();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  return (
    <div className="plan-management p-4">
      <h2 className="text-xl font-semibold mb-6">行程管理</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* 列表页 */}
      {!isDetail && (
        <>
          <div className="search-section mb-6">
            <input
              type="text"
              placeholder="输入行程ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="px-4 py-2 border rounded-l-md w-1/3 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              搜索
            </button>
          </div>
          
          <div className="data-list">
            <h3 className="font-semibold mb-3">行程列表</h3>
            {plans.length === 0 ? (
              <p className="text-gray-500">暂无行程</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">行程ID</th>
                    <th className="border p-2 text-left">行程名称</th>
                    <th className="border p-2 text-left">出发地</th>
                    <th className="border p-2 text-left">目的地</th>
                    <th className="border p-2 text-left">价格</th>
                    <th className="border p-2 text-left">状态</th>
                    <th className="border p-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id} className="border-b">
                      <td className="border p-2">{plan.id}</td>
                      <td className="border p-2">{plan.title}</td>
                      <td className="border p-2">{plan.departure}</td>
                      <td className="border p-2">{plan.destination}</td>
                      <td className="border p-2">¥{plan.price}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.status === 'active' ? '活跃' : '非活跃'}
                        </span>
                      </td>
                      <td className="border p-2">
                        <button
                          onClick={() => navigate(`/plan-detail/${plan.id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      
      {/* 详情页 */}
      {isDetail && detailPlan && (
        <>
          <div className="detail-header flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">行程详情</h3>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              返回列表
            </button>
          </div>
          
          <div className="detail-form">
            <div className="mb-4">
              <label htmlFor="id" className="block text-gray-700 mb-2">行程ID</label>
              <input
                type="text"
                id="id"
                value={detailPlan.id}
                disabled
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">行程名称</label>
              <input
                type="text"
                id="title"
                value={detailPlan.title}
                onChange={(e) => {
                  setDetailPlan({
                    ...detailPlan,
                    title: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="departure" className="block text-gray-700 mb-2">出发地</label>
                <input
                  type="text"
                  id="departure"
                  value={detailPlan.departure}
                  onChange={(e) => {
                    setDetailPlan({
                      ...detailPlan,
                      departure: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="destination" className="block text-gray-700 mb-2">目的地</label>
                <input
                  type="text"
                  id="destination"
                  value={detailPlan.destination}
                  onChange={(e) => {
                    setDetailPlan({
                      ...detailPlan,
                      destination: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-gray-700 mb-2">价格</label>
                <input
                  type="number"
                  id="price"
                  value={detailPlan.price}
                  onChange={(e) => {
                    setDetailPlan({
                      ...detailPlan,
                      price: parseInt(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="days" className="block text-gray-700 mb-2">行程天数</label>
                <input
                  type="number"
                  id="days"
                  value={detailPlan.days}
                  onChange={(e) => {
                    setDetailPlan({
                      ...detailPlan,
                      days: parseInt(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
           
            <div className="mb-4">
              <label htmlFor="accommodation" className="block text-gray-700 mb-2">住宿</label>
              <input
                type="text"
                id="accommodation"
                value={detailPlan.accommodation}
                onChange={(e) => {
                  setDetailPlan({
                    ...detailPlan,
                    accommodation: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="transportation" className="block text-gray-700 mb-2">交通</label>
              <input
                type="text"
                id="transportation"
                value={detailPlan.transportation}
                onChange={(e) => {
                  setDetailPlan({
                    ...detailPlan,
                    transportation: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="includedServices" className="block text-gray-700 mb-2">包含服务</label>
              <input
                type="text"
                id="includedServices"
                value={detailPlan.includedServices}
                onChange={(e) => {
                  setDetailPlan({
                    ...detailPlan,
                    includedServices: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
           
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleSave(detailPlan)}
                className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存修改
              </button>
        
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanManagement;