import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPage = ({ account }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [orders, setOrders] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStatus, setCurrentStatus] = useState('all'); // 订单状态筛选
    const [statusMap, setStatusMap] = useState({
        'unPaid': '未支付',
        'unDeparted': '待出行',
        'completed': '已完成',
        'cancelled': '已取消'
    });

    // API 基础 URL
    const Comment_URL = 'http://localhost:comment/api';
    const Order_URL = 'http://localhost:order/api';
    const Plan_URL = 'http://localhost:plan/api';

    // 搜索行程
    const handleSearch = async () => {
        if (!start || !end) {
            setError('请输入出发地和目的地');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(
                `${Plan_URL}/plans/search?departure=${start}&destination=${end}`
            );
            setSearchResults(response.data);
        } catch (err) {
            setError('搜索失败，请稍后再试');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 生成订单
    const handleGenerateOrder = async (planId) => {
        setLoading(true);
        setError('');
        
        try {
            const orderData = {
                planId,
                userId: account, // 假设 account 是用户ID
                status: 'unPaid', // 初始状态为未支付
                orderTime: new Date().toISOString()
            };
            
            const response = await axios.post(
                `${Order_URL}/orders`,
                orderData
            );
            
            // 添加新订单到状态
            setOrders([...orders, response.data]);
            
            // 成功提示
            alert('订单生成成功，请尽快支付！');
        } catch (err) {
            setError('订单生成失败，请稍后再试');
            console.error('Order generation error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 获取订单
    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        
        try {
            let url = `${Order_URL}/orders?userId=${account}`;
            
            // 如果有状态筛选
            if (currentStatus !== 'all') {
                url += `&status=${currentStatus}`;
            }
            
            const response = await axios.get(url);
            setOrders(response.data);
        } catch (err) {
            setError('获取订单失败，请稍后再试');
            console.error('Fetch orders error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 筛选订单状态
    const filterOrdersByStatus = (status) => {
        setCurrentStatus(status);
        fetchOrders();
    };

    // 取消订单
    const cancelOrder = async (orderId) => {
        if (!window.confirm('确定要取消该订单吗？')) return;
        
        setLoading(true);
        setError('');
        
        try {
            await axios.put(
                `${Order_URL}/orders/${orderId}/status`,
                { status: 'cancelled' }
            );
            
            // 更新本地订单状态
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: 'cancelled' } : order
            ));
            
            alert('订单已取消');
        } catch (err) {
            setError('取消订单失败，请稍后再试');
            console.error('Cancel order error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 添加评论
    const addComment = async (planId) => {
        const content = prompt('请输入评论内容：');
        if (!content) return;
        
        setLoading(true);
        setError('');
        
        try {
            const commentData = {
                planId,
                userId: account,
                content,
                commentTime: new Date().toISOString()
            };
            
            await axios.post(
                `${Comment_URL}/comments`,
                commentData
            );
            
            alert('评论添加成功！');
        } catch (err) {
            setError('评论添加失败，请稍后再试');
            console.error('Add comment error:', err);
        } finally {
            setLoading(false);
        }
    };

    // // 页面加载时自动获取订单
    // useEffect(() => {
    //     if (account) {
    //         fetchOrders();
    //     }
    // }, [account, currentStatus,]);

    return (
        <div className="user-page">
            <h1>Welcome, {account}</h1>
            
            {/* 搜索表单 */}
            <div className="search-form">
                <input
                    type="text"
                    placeholder="出发地"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="目的地"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? '搜索中...' : '搜索'}
                </button>
                
                {error && <p className="error-message">{error}</p>}
            </div>
            
            {/* 订单状态筛选 */}
            <div className="order-filters">
                <button 
                    onClick={() => filterOrdersByStatus('all')}
                    className={currentStatus === 'all' ? 'active' : ''}
                >
                    全部订单
                </button>
                <button 
                    onClick={() => filterOrdersByStatus('unPaid')}
                    className={currentStatus === 'unPaid' ? 'active' : ''}
                >
                    未支付
                </button>
                <button 
                    onClick={() => filterOrdersByStatus('unDeparted')}
                    className={currentStatus === 'unDeparted' ? 'active' : ''}
                >
                    待出行
                </button>
                <button 
                    onClick={() => filterOrdersByStatus('completed')}
                    className={currentStatus === 'completed' ? 'active' : ''}
                >
                    已完成
                </button>
                <button 
                    onClick={() => filterOrdersByStatus('cancelled')}
                    className={currentStatus === 'cancelled' ? 'active' : ''}
                >
                    已取消
                </button>
            </div>
            
            {/* 订单列表 */}
            <div className="orders-section">
                <h2>我的订单</h2>
                {loading && <p>加载中...</p>}
                {orders.length === 0 ? (
                    <p>暂无订单</p>
                ) : (
                    <ul>
                        {orders.map((order) => (
                            <li 
                                key={order.id} 
                                className={`order-item status-${order.status.toLowerCase()}`}
                                style={{ borderLeft: getStatusBorderColor(order.status) }}
                            >
                                <div className="order-header">
                                    <span className="order-id">订单ID: {order.id}</span>
                                    <span className="order-status-tag" style={{ backgroundColor: getStatusColor(order.status) }}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <div className="order-details">
                                    <p>行程ID: {order.planId}</p>
                                    <p>下单时间: {formatDate(order.orderTime)}</p>
                                </div>
                                <div className="order-actions">
                                    {order.status === 'unPaid' && (
                                        <button 
                                            onClick={() => handlePayment(order.id)}
                                            className="payment-button"
                                        >
                                            去支付
                                        </button>
                                    )}
                                    {order.status === 'unDeparted' && (
                                        <button 
                                            onClick={() => cancelOrder(order.id)}
                                            className="cancel-button"
                                        >
                                            取消订单
                                        </button>
                                    )}
                                    {order.status === 'completed' && (
                                        <button 
                                            onClick={() => addComment(order.planId)}
                                            className="comment-button"
                                        >
                                            添加评论
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {/* 搜索结果 */}
            <div className="search-results-section">
                <h2>搜索结果</h2>
                {loading && <p>加载中...</p>}
                {searchResults.length === 0 ? (
                    <p>没有找到匹配的行程</p>
                ) : (
                    <ul>
                        {searchResults.map((plan) => (
                            <li key={plan.id} className="plan-item">
                                <div className="plan-header">
                                    <h3>{plan.title}</h3>
                                    <p>预算: ¥{plan.budget} | 天数: {plan.days}天</p>
                                </div>
                                <div className="plan-location">
                                    <p>出发地: {plan.departure} → 目的地: {plan.destination}</p>
                                    {plan.waypoint && <p>途经点: {plan.waypoint}</p>}
                                </div>
                                <button 
                                    onClick={() => handleGenerateOrder(plan.id)}
                                    disabled={loading}
                                    className="generate-order-button"
                                >
                                    生成订单
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    // 辅助函数：获取状态文本
    function getStatusText(status) {
        return statusMap[status] || status;
    }

    // 辅助函数：获取状态颜色
    function getStatusColor(status) {
        const colorMap = {
            'unPaid': '#f8b195',
            'unDeparted': '#f67280',
            'completed': '#78b7c5',
            'cancelled': '#c06c84'
        };
        return colorMap[status] || '#9575cd';
    }

    // 辅助函数：获取状态边框颜色
    function getStatusBorderColor(status) {
        const colorMap = {
            'unPaid': '#f8b195',
            'unDeparted': '#f67280',
            'completed': '#78b7c5',
            'cancelled': '#c06c84'
        };
        return colorMap[status] || '#9575cd';
    }

    // 辅助函数：格式化日期
    function formatDate(dateString) {
        if (!dateString) return '未知';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    // 处理支付（示例函数）
    function handlePayment(orderId) {
        alert('即将跳转到支付页面...');
        // 实际项目中应调用支付API
    }
};

export default UserPage;