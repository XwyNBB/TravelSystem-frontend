import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CommentManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchId, setSearchId] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDetail, setIsDetail] = useState(false);
  const [detailComment, setDetailComment] = useState(null);

  // 模拟从后端获取评论数据
  const fetchComments = async () => {
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟评论数据
      const mockComments = [
        { id: 'CMT001', planId: 'PLN001', content: '行程很满意！酒店位置很好，导游讲解详细。', rating: 5, date: '2025-06-10' },
        { id: 'CMT002', planId: 'PLN002', content: '导游很专业，景点安排合理，午餐也不错。', rating: 4, date: '2025-06-12' },
        { id: 'CMT003', planId: 'PLN001', content: '行程安排太紧凑，酒店设施一般。', rating: 3, date: '2025-06-08' },
        { id: 'CMT004', planId: 'PLN003', content: '杭州风景很美，三日游很充实，推荐！', rating: 5, date: '2025-06-05' }
      ];
      
      setComments(mockComments);
    } catch (err) {
      setError('获取评论数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 搜索特定ID的评论
  const handleSearch = () => {
    if (!searchId) {
      setError('请输入评论ID');
      return;
    }
    
    const comment = comments.find(comment => comment.id === searchId);
    if (comment) {
      setDetailComment(comment);
      setIsDetail(true);
    } else {
      setError(`未找到ID为 ${searchId} 的评论`);
    }
  };

  // 返回列表页
  const handleBackToList = () => {
    setIsDetail(false);
    setDetailComment(null);
    setSearchId('');
  };

  // 保存修改
  const handleSave = (updatedComment) => {
    setDetailComment(updatedComment);
    setError('评论修改已保存');
    
    // 2秒后清除提示
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  // 删除评论
  const handleDelete = () => {
    if (!detailComment) return;
    
    setError(`已删除ID为 ${detailComment.id} 的评论`);
    setIsDetail(false);
    setDetailComment(null);
    
    // 2秒后清除提示并重新加载数据
    setTimeout(() => {
      setError('');
      fetchComments();
    }, 2000);
  };

  // 组件挂载时获取评论数据
  useEffect(() => {
    fetchComments();
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
    <div className="comment-management p-4">
      <h2 className="text-xl font-semibold mb-6">评论管理</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* 列表页 */}
      {!isDetail && (
        <>
          <div className="search-section mb-6">
            <input
              type="text"
              placeholder="输入评论ID"
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
            <h3 className="font-semibold mb-3">评论列表</h3>
            {comments.length === 0 ? (
              <p className="text-gray-500">暂无评论</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">评论ID</th>
                    <th className="border p-2 text-left">行程ID</th>
                    <th className="border p-2 text-left">评分</th>
                    <th className="border p-2 text-left">评论日期</th>
                    <th className="border p-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(comment => (
                    <tr key={comment.id} className="border-b">
                      <td className="border p-2">{comment.id}</td>
                      <td className="border p-2">{comment.planId}</td>
                      <td className="border p-2">{comment.rating} 星</td>
                      <td className="border p-2">{comment.date}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => navigate(`/comment-detail/${comment.id}`)}
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
      {isDetail && detailComment && (
        <>
          <div className="detail-header flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">评论详情</h3>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              返回列表
            </button>
          </div>
          
          <div className="detail-form">
            <div className="mb-4">
              <label htmlFor="id" className="block text-gray-700 mb-2">评论ID</label>
              <input
                type="text"
                id="id"
                value={detailComment.id}
                disabled
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="planId" className="block text-gray-700 mb-2">行程ID</label>
              <input
                type="text"
                id="planId"
                value={detailComment.planId}
                onChange={(e) => {
                  setDetailComment({
                    ...detailComment,
                    planId: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 mb-2">评论内容</label>
              <textarea
                id="content"
                value={detailComment.content}
                onChange={(e) => {
                  setDetailComment({
                    ...detailComment,
                    content: e.target.value
                  });
                }}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700 mb-2">评分</label>
              <select
                id="rating"
                value={detailComment.rating}
                onChange={(e) => {
                  setDetailComment({
                    ...detailComment,
                    rating: parseInt(e.target.value)
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1星</option>
                <option value="2">2星</option>
                <option value="3">3星</option>
                <option value="4">4星</option>
                <option value="5">5星</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="date" className="block text-gray-700 mb-2">评论日期</label>
              <input
                type="text"
                id="date"
                value={detailComment.date}
                onChange={(e) => {
                  setDetailComment({
                    ...detailComment,
                    date: e.target.value
                  });
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleSave(detailComment)}
                className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                保存修改
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                删除评论
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentManagement;