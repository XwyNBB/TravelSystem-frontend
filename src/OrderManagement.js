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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [newStatus, setNewStatus] = useState(''); // 初始化为空字符串

  // 模拟从后端获取订单数据
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
      setNewStatus(order.status); // 初始化新状态为当前订单状态
    } else {
      setError(`未找到ID为 ${searchId} 的订单`);
    }
  };

  // 返回列表页
  const handleBackToList = () => {
    setIsDetail(false);
    setDetailOrder(null);
    setSearchId('');
    setShowPasswordModal(false);
    setShowStatusForm(false);
  };

  // 显示密码弹窗
  const handleShowPasswordModal = () => {
    setShowPasswordModal(true);
  };

  // 取消密码验证
  const handleCancelPassword = () => {
    setShowPasswordModal(false);
    setAdminPassword('');
  };

  // 验证管理员密码
  const handleVerifyPassword = () => {
    if (adminPassword === 'test') {
      // 合并状态更新
      setShowPasswordModal(false);
      setShowStatusForm(true);
      setAdminPassword('');
    } else {
      setError('密码错误，请重试');
      setTimeout(() => setError(''), 3000);
    }
  };

  // 保存状态修改
  const handleSaveStatus = () => {
    if (!detailOrder) return;
    
    setDetailOrder({
      ...detailOrder,
      status: newStatus
    });
    
    setShowStatusForm(false);
    setError('订单状态已更新');
    
    setTimeout(() => setError(''), 3000);
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

  // 当detailOrder更新时，同步newStatus
  useEffect(() => {
    if (detailOrder) {
      setNewStatus(detailOrder.status);
    }
  }, [detailOrder]);

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
          
          <div className="detail-table mb-6">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">订单ID</th>
                  <td className="border p-3">{detailOrder.id}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">行程ID</th>
                  <td className="border p-3">{detailOrder.planId}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">乘客姓名</th>
                  <td className="border p-3">{detailOrder.passengerName}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">联系电话</th>
                  <td className="border p-3">{detailOrder.passengerPhone}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">乘客数量</th>
                  <td className="border p-3">{detailOrder.numOfPassengers} 人</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">订单金额</th>
                  <td className="border p-3">¥{detailOrder.totalAmount}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">订单状态</th>
                  <td className="border p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      detailOrder.status === 'unpaid' ? 'bg-yellow-100 text-yellow-800' :
                      detailOrder.status === 'unused' ? 'bg-blue-100 text-blue-800' :
                      detailOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {detailOrder.status === 'unpaid' ? '未支付' :
                       detailOrder.status === 'unused' ? '未使用' :
                       detailOrder.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">下单日期</th>
                  <td className="border p-3">{detailOrder.orderDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* 处理订单密码验证弹窗 */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-1/3 max-w-md">
                <h3 className="text-xl font-semibold mb-4">管理员密码验证</h3>
                <div className="mb-4">
                  <label htmlFor="adminPassword" className="block text-gray-700 mb-2">输入管理员密码</label>
                  <input
                    type="password"
                    id="adminPassword"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelPassword}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleVerifyPassword}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    验证
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 状态修改表单 */}
          {showStatusForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">修改订单状态</h3>
              <div className="mb-4">
                <label htmlFor="newStatus" className="block text-gray-700 mb-2">选择新状态</label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unpaid">未支付</option>
                  <option value="unused">未使用</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              <button
                onClick={handleSaveStatus}
                className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                保存修改
              </button>
            </div>
          )}
          
          {!showStatusForm && (
      <div className="mt-6">
        <button
          onClick={handleShowPasswordModal}
          className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          处理订单
        </button>
      </div>
    )}
        </>
      )}
    </div>
  );
};

export default OrderManagement;