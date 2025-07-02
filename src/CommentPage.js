import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CommentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);

  // 获取订单数据
  useEffect(() => {
    if (id) {
      const order = location.state;
      if (order) {
        setOrderData(order);
        setLoading(false);
      } else {
        setError('未找到订单信息');
        setLoading(false);
      }
    }
  }, [id, location.state]);

  // 评论提交成功后返回订单列表
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/user-home');
      }, 1500);
    }
  }, [success, navigate]);

  // 模拟提交评论
  const submitComment = async () => {
    if (!comment.trim()) {
      setError('评论内容不能为空');
      return;
    }

    setSubmitting(true);
    setError('');

    // await new Promise(resolve => setTimeout(resolve, 1200));

    const response = await axois.post('/api/newComment', {
      orderId: id,  
      content: comment,
      rating, 
      createdAt: new Date().toISOString()
    });}

  //   try {
  //     console.log('模拟提交评论:', {
  //       orderId: id,
  //       content: comment,
  //       rating,
  //       createdAt: new Date().toISOString()
  //     });

  //     setSuccess(true);
  //     setComment('');
  //   } catch (err) {
  //     setError('提交评论失败，请稍后再试');
  //     console.error('Submit comment error:', err);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

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
      {/* ...其余代码不变... */}
    </div>
  );
};

export default CommentPage;