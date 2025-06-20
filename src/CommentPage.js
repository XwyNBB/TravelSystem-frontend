// CommentPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CommentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5); // 评分功能

  // 模拟订单数据
  const mockOrderData = {
    id: id || 'ORD-20230615-12345',
    title: '三亚5日游',
    date: '2023-06-10T08:30:00',
    total: 3980,
    passengers: 2,
    status: 'completed',
    statusText: '已完成'
  };

  // 模拟获取订单详情
  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // 模拟API响应
      setOrderData(mockOrderData);
    } catch (err) {
      setError('获取订单详情失败，请稍后再试');
      console.error('Fetch order error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 模拟提交评论
  const submitComment = async () => {
    if (!comment.trim()) {
      setError('评论内容不能为空');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      // 模拟API成功响应
      console.log('模拟提交评论:', {
        orderId: id,
        content: comment,
        rating,
        createdAt: new Date().toISOString()
      });
      
      setSuccess(true);
      setComment('');
    } catch (err) {
      setError('提交评论失败，请稍后再试');
      console.error('Submit comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // 组件挂载时获取订单数据
  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    } else {
      navigate('/user-home');
    }
  }, [id, navigate]);

  // 评论提交成功后返回订单列表
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/user-home');
      }, 1500);
    }
  }, [success, navigate]);

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || '未找到订单信息'}</p>
        <button onClick={() => navigate('/user-home')} className="px-4 py-2 bg-gray-200 rounded">返回订单列表</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">评价订单</h1>
        <button onClick={() => navigate('/user-home')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
          返回Home
        </button>
      </div>
      
      {/* 订单信息卡片 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">订单号: {orderData.id}</h2>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {orderData.statusText}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">下单日期:</span> {formatDate(orderData.date)}</p>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">订单金额:</span> ¥{orderData.total}</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">支付方式:</span> 微信支付</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">行程名称:</span> {orderData.title}</p>
            <p className="text-gray-600 mb-1"><span className="font-medium text-gray-800">乘客数量:</span> {orderData.passengers} 人</p>
            <p className="text-gray-600"><span className="font-medium text-gray-800">出行日期:</span> 2023-06-15 至 2023-06-19</p>
          </div>
        </div>
      </div>
      
      {/* 评论表单 */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">写下你的评价</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <div className="flex items-center">
              <span style={{ marginRight: '8px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
            <div className="flex items-center">
              <span style={{ marginRight: '8px' }}>✅</span>
              <span>评论提交成功，感谢您的反馈！</span>
            </div>
          </div>
        )}
        
        {/* 评分功能 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">评分</label>
          <div className="flex text-yellow-400 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`mr-1 cursor-pointer transition-transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-gray-600">{rating}星</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">评价内容</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="5"
            placeholder="请分享你的旅行体验和建议，帮助其他旅行者做出更好的选择..."
          ></textarea>
        </div>
        
        <button
          onClick={submitComment}
          className={`w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium ${
            submitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={submitting || comment.length < 1}
        >
          {submitting ? (
            <div className="flex justify-center items-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              提交中...
            </div>
          ) : (
            '提交评论'
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentPage;