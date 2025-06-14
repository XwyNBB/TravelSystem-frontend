import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchId, setSearchId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetail, setIsDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);

  // 模拟从后端获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟订单数据
      const mockOrders = [
        { id: 'ORD001', planId: 'PLN002', passengerName: '张三', passengerPhone: '13800138001', 
          numOfPassengers: 2, totalAmount: 598, status: 'unpaid', orderDate: '2025-06-10' },
        { id: 'ORD002', planId: 'PLN001', passengerName: '李四', passengerPhone: '13900139002', 
          numOfPassengers: 1, totalAmount: 599, status: 'unused', orderDate: '2025-06-12' },
        { id: 'ORD003', planId: 'PLN003', passengerName: '王五', passengerPhone: '13700137003', 
          numOfPassengers: 3, totalAmount: 2397, status: 'completed', orderDate: '2025-06-05' },
        { id: 'ORD004', planId: 'PLN004', passengerName: '赵六', passengerPhone: '13600136004', 
          numOfPassengers: 1, totalAmount: 199, status: 'cancelled', orderDate: '2025-06-01' }
      ];
      
      setOrders(mockOrders);
    } catch (err) {
      setError('获取订单数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 搜索特定ID的订单
  const handleSearch = () => {
    if (!searchId) {
      setError('请输入订单ID');
      return;
    }
    
    const order = orders.find(order => order.id === searchId);
    if (order) {
      setDetailOrder(order);
      setIsDetail(true);
    } else {
      setError(`未找到ID为 ${searchId} 的订单`);
    }
  };

  // 返回列表页
  const handleBackToList = () => {
    setIsDetail(false);
    setDetailOrder(null);
    setSearchId('');
  };

  // 保存修改
  const handleSave = (updatedOrder) => {
    setDetailOrder(updatedOrder);
    setError('订单信息已更新');
    
    // 2秒后清除提示
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  // 处理订单
  const handleProcessOrder = () => {
    if (!detailOrder) return;
    
    setDetailOrder({
      ...detailOrder,
      status: detailOrder.status === 'unpaid' ? 'unused' : 
               detailOrder.status === 'unused' ? 'completed' : 
               detailOrder.status
    });
    
    setError('订单状态已更新');
    
    // 2秒后清除提示
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  // 取消订单
  const handleCancelOrder = () => {
    if (!detailOrder) return;
    
    setDetailOrder({
      ...detailOrder,
      status: 'cancelled'
    });
    
    setError('订单已取消');
    
    // 2秒后清除提示
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  // 组件挂载时获取订单数据
  useEffect(() => {
    fetchOrders();
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
    <div className="order-management p-4">
      <h2 className="text-xl font-semibold mb-6">订单管理</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* 列表页 */}
      {!isDetail && (
        <>
          <div className="search-section mb-6">
            <input
              type="text"
              placeholder="输入订单ID"
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
            <h3 className="font-semibold mb-3">订单列表</h3>
            {orders.length === 0 ? (
              <p className="text-gray-500">暂无订单</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">订单ID</th>
                    <th className="border p-2 text-left">行程ID</th>
                    <th className="border p-2 text-left">乘客姓名</th>
                    <th className="border p-2 text-left">订单金额</th>
                    <th className="border p-2 text-left">乘客数量</th>
                    <th className="border p-2 text-left">订单状态</th>
                    <th className="border p-2 text-left">下单日期</th>
                    <th className="border p-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="border p-2">{order.id}</td>
                      <td className="border p-2">{order.planId}</td>
                      <td className="border p-2">{order.passengerName}</td>
                      <td className="border p-2">¥{order.totalAmount}</td>
                      <td className="border p-2">{order.numOfPassengers} 人</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'unused' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'unpaid' ? '未支付' :
                           order.status === 'unused' ? '未使用' :
                           order.status === 'completed' ? '已完成' : '已取消'}
                        </span>
                      </td>
                      <td className="border p-2">{order.orderDate}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => navigate(`/order-detail/${order.id}`)}
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
      {isDetail && detailOrder && (
        <>
          <div className="detail-header flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">订单详情</h3>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              返回列表
            </button>
          </div>
          
          <div className="detail-form">
            <div className="mb-4">
              <label htmlFor="id" className="block text-gray-700 mb-2">订单ID</label>
              <input
                type="text"
                id="id"
                value={detailOrder.id}
                disabled
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="planId" className="block text-gray-700 mb-2">行程ID</label>
                <input
                  type="text"
                  id="planId"
                  value={detailOrder.planId}
                  onChange={(e) => {
                    setDetailOrder({
                      ...detailOrder,
                      planId: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="passengerName" className="block text-gray-700 mb-2">乘客姓名</label>
                <input
                  type="text"
                  id="passengerName"
                  value={detailOrder.passengerName}
                  onChange={(e) => {
                    setDetailOrder({
                      ...detailOrder,
                      passengerName: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="passengerPhone" className="block text-gray-700 mb-2">联系电话</label>
                <input
                  type="text"
                  id="passengerPhone"
                  value={detailOrder.passengerPhone}
                  onChange={(e) => {
                    setDetailOrder({
                      ...detailOrder,
                      passengerPhone: e.target.value
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="numOfPassengers" className="block text-gray-700 mb-2">乘客数量</label>
                <input
                  type="number"
                  id="numOfPassengers"
                  value={detailOrder.numOfPassengers}
                  onChange={(e) => {
                    setDetailOrder({
                      ...detailOrder,
                      numOfPassengers: parseInt(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="totalAmount" className="block text-gray-700 mb-2">订单金额</label>
              <input
                type="number"
                id="totalAmount"
                value={detailOrder.totalAmount}
                onChange={(e) => {
                  setDetailOrder({
                    ...detailOrder,
                    totalAmount: parseInt(e.target.value)
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 mb-2">订单状态</label>
              <select
                id="status"
                value={detailOrder.status}
                onChange={(e) => {
                  setDetailOrder({
                    ...detailOrder,
                    status: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unpaid">未支付</option>
                <option value="unused">未使用</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="orderDate" className="block text-gray-700 mb-2">下单日期</label>
              <input
                type="date"
                id="orderDate"
                value={detailOrder.orderDate}
                onChange={(e) => {
                  setDetailOrder({
                    ...detailOrder,
                    orderDate: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleSave(detailOrder)}
                className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存修改
              </button>
              <button
                onClick={handleProcessOrder}
                className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                处理订单
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                取消订单
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManagement;