import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsPanel from './StatsPanel';
import CommentManagement from './CommentManagement';
import PlanManagement from './PlanManagement';
import OrderManagement from './OrderManagement';

const StaffHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats'); // stats, comments, plans, orders
  const [statsData, setStatsData] = useState({
    popularPlans: [],
    profitablePlans: [],
    popularLocations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 模拟从后端获取统计数据
  const fetchStatsData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟统计数据
      const data = {
        popularPlans: [
          { id: 'PLN002', title: '广州-深圳一日游', orderCount: 256 },
          { id: 'PLN001', title: '北京-上海周末游', orderCount: 128 },
          { id: 'PLN004', title: '北京-天津一日游', orderCount: 187 },
          { id: 'PLN003', title: '上海-杭州三日游', orderCount: 89 }
        ],
        profitablePlans: [
          { id: 'PLN003', title: '上海-杭州三日游', revenue: 799 * 89 },
          { id: 'PLN001', title: '北京-上海周末游', revenue: 599 * 128 },
          { id: 'PLN002', title: '广州-深圳一日游', revenue: 299 * 256 },
          { id: 'PLN004', title: '北京-天津一日游', revenue: 199 * 187 }
        ],
        popularLocations: [
          { city: '北京', count: 315 },
          { city: '上海', count: 217 },
          { city: '广州', count: 256 },
          { city: '深圳', count: 189 },
          { city: '杭州', count: 89 }
        ]
      };
      
      setStatsData(data);
    } catch (err) {
      setError('获取统计数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取统计数据
  useEffect(() => {
    fetchStatsData();
  }, []);

  // 切换管理模块
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="staff-home container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">员工管理主页</h1>
      
      {/* 管理功能按钮 */}
      <div className="management-buttons mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleTabChange('stats')}
          className={`px-5 py-2 rounded-md ${
            activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          数据统计
        </button>
        <button
          onClick={() => handleTabChange('comments')}
          className={`px-5 py-2 rounded-md ${
            activeTab === 'comments' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          评论管理
        </button>
        <button
          onClick={() => handleTabChange('plans')}
          className={`px-5 py-2 rounded-md ${
            activeTab === 'plans' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          行程管理
        </button>
        <button
          onClick={() => handleTabChange('orders')}
          className={`px-5 py-2 rounded-md ${
            activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          订单管理
        </button>
      </div>
      
      {/* 数据统计面板 */}
      {activeTab === 'stats' && (
        <div className="stats-panel">
          {loading && <p className="text-center text-gray-500">加载中...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          
          {!loading && !error && (
            <>
              <h2 className="text-xl font-semibold mb-4">数据概览</h2>
              
              {/* 热门行程 */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">热门行程 (前10)</h3>
                <div className="bg-white p-4 rounded-lg border">
                  {statsData.popularPlans.map((plan, index) => (
                    <div key={plan.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{plan.title}</span>
                      <span className="font-medium">{plan.orderCount} 单</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 赚钱行程 */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3">赚钱行程 (前10)</h3>
                <div className="bg-white p-4 rounded-lg border">
                  {statsData.profitablePlans.map((plan, index) => (
                    <div key={plan.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{plan.title}</span>
                      <span className="font-medium">¥{plan.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 热门地点 */}
              <div>
                <h3 className="font-semibold text-lg mb-3">热门地点 (前10)</h3>
                <div className="bg-white p-4 rounded-lg border">
                  {statsData.popularLocations.map((location, index) => (
                    <div key={location.city} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span>{location.city}</span>
                      <span className="font-medium">{location.count} 单</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* 评论管理面板 */}
      {activeTab === 'comments' && (
        <CommentManagement />
      )}
      
      {/* 行程管理面板 */}
      {activeTab === 'plans' && (
        <PlanManagement />
      )}
      
      {/* 订单管理面板 */}
      {activeTab === 'orders' && (
        <OrderManagement />
      )}
    </div>
  );
};

export default StaffHome;