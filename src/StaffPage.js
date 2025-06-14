import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const StaffPage = ({ account }) => {
    // 状态管理
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [comments, setComments] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentStatus, setCurrentStatus] = useState('all');
    
    // 状态映射
    const statusMap = {
        'unPaid': '未支付',
        'unDeparted': '待出行',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    
    // API 
    const Comment_URL = 'http://localhost:comment/api';
    const Order_URL = 'http://localhost:order/api';
    const Plan_URL = 'http://localhost:plan/api';

    // 获取订单数据
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            let url = `${Order_URL}/orders`;
            
            // 添加状态筛选
            if (currentStatus !== 'all') {
                url += `?status=${currentStatus}`;
            }
            
            // 添加搜索筛选
            if (searchQuery) {
                url += `${url.includes('?') ? '&' : '?'}search=${searchQuery}`;
            }
            
            const response = await axios.get(url);
            setOrders(response.data);
        } catch (err) {
            setError('获取订单失败，请稍后再试');
            console.error('Fetch orders error:', err);
        } finally {
            setLoading(false);
        }
    }, [currentStatus, searchQuery]);

    // 获取评论数据
    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            let url = `${Comment_URL}/comments`;
            
            // 添加搜索筛选
            if (searchQuery) {
                url += `?search=${searchQuery}`;
            }
            
            const response = await axios.get(url);
            setComments(response.data);
        } catch (err) {
            setError('获取评论失败，请稍后再试');
            console.error('Fetch comments error:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    // 获取统计数据
    const fetchStatistics = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            const [popularPlans, profitPlans, famousPlaces] = await Promise.all([
                axios.get(`${Plan_URL}/statistics/popular-plans`),
                axios.get(`${Plan_URL}/statistics/profit-plans`),
                axios.get(`${Plan_URL}/statistics/famous-places`)
            ]);
            
            setStatistics({
                popularPlans: popularPlans.data,
                profitPlans: profitPlans.data,
                famousPlaces: famousPlaces.data
            });
        } catch (err) {
            setError('获取统计数据失败，请稍后再试');
            console.error('Fetch statistics error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 筛选订单状态
    const filterOrdersByStatus = (status) => {
        setCurrentStatus(status);
        fetchOrders();
    };

    // 更新订单状态
    const updateOrderStatus = async (orderId, status) => {
        if (!window.confirm(`确定要将订单状态修改为${statusMap[status]}吗？`)) return;
        
        setLoading(true);
        setError('');
        
        try {
            await axios.put(
                `${Order_URL}/orders/${orderId}/status`,
                { status }
            );
            
            // 更新本地订单状态
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status } : order
            ));
            
            alert(`订单状态已更新为${statusMap[status]}`);
        } catch (err) {
            setError('更新订单状态失败，请稍后再试');
            console.error('Update order status error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 删除评论
    const deleteComment = async (commentId) => {
        if (!window.confirm('确定要删除这条评论吗？')) return;
        
        setLoading(true);
        setError('');
        
        try {
            await axios.delete(`${Comment_URL}/comments/${commentId}`);
            
            // 从本地状态中移除
            setComments(comments.filter(comment => comment.id !== commentId));
            
            alert('评论已删除');
        } catch (err) {
            setError('删除评论失败，请稍后再试');
            console.error('Delete comment error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 页面加载时自动获取数据
    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'comments') {
            fetchComments();
        } else if (activeTab === 'statistics') {
            fetchStatistics();
        }
    }, [activeTab, fetchOrders, fetchComments, fetchStatistics]);

    // 搜索处理
    const handleSearch = () => {
        if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'comments') {
            fetchComments();
        }
    };

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

    // 辅助函数：格式化日期
    function formatDate(dateString) {
        if (!dateString) return '未知';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    return (
        <div className="staff-page">
            <h1>Staff Dashboard - {account}</h1>
            
            {/* 导航标签 */}
            <div className="staff-tabs">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? 'active' : ''}
                >
                    订单管理
                </button>
                <button 
                    onClick={() => setActiveTab('comments')}
                    className={activeTab === 'comments' ? 'active' : ''}
                >
                    评论管理
                </button>
                <button 
                    onClick={() => setActiveTab('statistics')}
                    className={activeTab === 'statistics' ? 'active' : ''}
                >
                    数据统计
                </button>
            </div>
            
            {/* 搜索栏 */}
            <div className="search-form">
                <input
                    type="text"
                    placeholder="搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? '搜索中...' : '搜索'}
                </button>
                
                {error && <p className="error-message">{error}</p>}
            </div>
            
            {/* 订单管理标签页 */}
            {activeTab === 'orders' && (
                <div className="orders-section">
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
                    <h2>订单管理</h2>
                    {loading && <p>加载中...</p>}
                    {orders.length === 0 ? (
                        <p>暂无订单</p>
                    ) : (
                        <ul>
                            {orders.map((order) => (
                                <li 
                                    key={order.id} 
                                    className={`order-item status-${order.status.toLowerCase()}`}
                                    style={{ borderLeft: `4px solid ${getStatusColor(order.status)}` }}
                                >
                                    <div className="order-header">
                                        <span className="order-id">订单ID: {order.id}</span>
                                        <span className="order-status-tag" style={{ backgroundColor: getStatusColor(order.status) }}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                    <div className="order-details">
                                        <p>用户ID: {order.userId}</p>
                                        <p>行程ID: {order.planId}</p>
                                        <p>下单时间: {formatDate(order.orderTime)}</p>
                                        <p>价格: ¥{order.price}</p>
                                    </div>
                                    <div className="order-actions">
                                        {order.status === 'unPaid' && (
                                            <>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'unDeparted')}
                                                    className="status-button"
                                                >
                                                    标记为已支付
                                                </button>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                    className="cancel-button"
                                                >
                                                    取消订单
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'unDeparted' && (
                                            <>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                    className="status-button"
                                                >
                                                    标记为已完成
                                                </button>
                                                <button 
                                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                    className="cancel-button"
                                                >
                                                    取消订单
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            
            {/* 评论管理标签页 */}
            {activeTab === 'comments' && (
                <div className="comments-section">
                    <h2>评论管理</h2>
                    {loading && <p>加载中...</p>}
                    {comments.length === 0 ? (
                        <p>暂无评论</p>
                    ) : (
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment.id} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-user">用户: {comment.userId}</span>
                                        <span className="comment-time">{formatDate(comment.commentTime)}</span>
                                    </div>
                                    <div className="comment-content">
                                        <p>行程ID: {comment.planId}</p>
                                        <p className="content-text">{comment.content}</p>
                                    </div>
                                    <div className="comment-actions">
                                        <button 
                                            onClick={() => deleteComment(comment.id)}
                                            className="delete-button"
                                        >
                                            删除评论
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            
            {/* 数据统计标签页 */}
            {activeTab === 'statistics' && (
                <div className="statistics-section">
                    <h2>数据统计</h2>
                    {loading && <p>加载中...</p>}
                    
                    <div className="statistic-card">
                        <h3>热门行程统计</h3>
                        {statistics.popularPlans ? (
                            <ul>
                                {statistics.popularPlans.map((plan, index) => (
                                    <li key={index}>{plan.title} - {plan.count} 订单</li>
                                ))}
                            </ul>
                        ) : (
                            <p>暂无数据</p>
                        )}
                    </div>
                    
                    <div className="statistic-card">
                        <h3>盈利行程统计</h3>
                        {statistics.profitPlans ? (
                            <ul>
                                {statistics.profitPlans.map((plan, index) => (
                                    <li key={index}>{plan.title} - ¥{plan.profit}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>暂无数据</p>
                        )}
                    </div>
                    
                    <div className="statistic-card">
                        <h3>热门地点统计</h3>
                        {statistics.famousPlaces ? (
                            <ul>
                                {statistics.famousPlaces.map((place, index) => (
                                    <li key={index}>{place.name} - {place.count} 访问</li>
                                ))}
                            </ul>
                        ) : (
                            <p>暂无数据</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPage;
