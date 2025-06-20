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
  const [sortType, setSortType] = useState('date-desc'); // 默认按日期降序

  // 模拟数据
  const mockComments = [
    { id: 'CMT001', planId: 'PLN001', content: '行程很满意！酒店位置很好，导游讲解详细。', rating: 5, date: '2025-06-10' },
    { id: 'CMT002', planId: 'PLN002', content: '导游很专业，景点安排合理，午餐也不错。', rating: 4, date: '2025-06-12' },
    { id: 'CMT003', planId: 'PLN001', content: '行程安排太紧凑，酒店设施一般。', rating: 3, date: '2025-06-08' },
    { id: 'CMT004', planId: 'PLN003', content: '杭州风景很美，三日游很充实，推荐！', rating: 5, date: '2025-06-05' }
  ];

  // 组件挂载时立即设置模拟数据
  useEffect(() => {
    // 模拟API请求延迟
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 800);
  }, []);

  // 排序评论
  const sortComments = (commentsList) => {
    const sorted = [...commentsList];
    
    if (sortType === 'rating-desc') {
      return sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortType === 'rating-asc') {
      return sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortType === 'date-desc') {
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === 'date-asc') {
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return sorted;
  };

  // 处理排序变更
  const handleSortChange = (type) => {
    setSortType(type);
  };

  // 搜索特定ID的评论
  const handleSearch = () => {
    if (!searchId) {
      setError('请输入ID');
      return;
    }
    //请求后端，这里用模拟数据
    // 格式类似mockComments
    // 省略planid（因为就是根据planid检索的）
    //each comment 后面都有一个删除button
  };
  // 返回列表页
  const handleBackToList = () => {
    setIsDetail(false);
    setDetailComment(null);
    setSearchId('');
  };

  // 删除评论
  const handleDelete = () => {
    if (!detailComment) return;
    
    // 从列表中删除评论
    setComments(prev => prev.filter(comment => comment.id !== detailComment.id));
    
    setError(`已删除ID为 ${detailComment.id} 的评论`);
    setIsDetail(false);
    setDetailComment(null);
    
    // 2秒后清除提示
    setTimeout(() => {
      setError('');
    }, 2000);
  };

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

  // 排序后的评论列表
  const sortedComments = sortComments(comments);

  return (
    <div className="comment-management p-4">
      <h2 className="text-xl font-semibold mb-6">评论管理</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* 排序选项 */}
      <div className="sort-options mb-6 flex gap-4">
        <span className="font-medium">排序方式:</span>
        <button
          className={`px-3 py-1 rounded-md ${sortType === 'rating-desc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => handleSortChange('rating-desc')}
        >
          星级 ↓
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortType === 'rating-asc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => handleSortChange('rating-asc')}
        >
          星级 ↑
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortType === 'date-desc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => handleSortChange('date-desc')}
        >
          日期 ↓
        </button>
        <button
          className={`px-3 py-1 rounded-md ${sortType === 'date-asc' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => handleSortChange('date-asc')}
        >
          日期 ↑
        </button>
      </div>
      
      {/* 列表页 */}
      {!isDetail && (
        <>
          <div className="search-section mb-6">
            <input
              type="text"
              placeholder="输入PlanID"
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
            {sortedComments.length === 0 ? (
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
                  {sortedComments.map(comment => (
                    <tr key={comment.id} className="border-b">
                      <td className="border p-2">{comment.id}</td>
                      <td className="border p-2">{comment.planId}</td>
                      <td className="border p-2">{comment.rating} 星</td>
                      <td className="border p-2">{comment.date}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => navigate(`/details-page/${comment.id}`)}
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
          
          <div className="detail-table mb-6">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">评论ID</th>
                  <td className="border p-3">{detailComment.id}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">行程ID</th>
                  <td className="border p-3">{detailComment.planId}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">评论内容</th>
                  <td className="border p-3">{detailComment.content}</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">评分</th>
                  <td className="border p-3">{detailComment.rating} 星</td>
                </tr>
                <tr>
                  <th className="border p-3 text-left w-1/4 bg-gray-50">评论日期</th>
                  <td className="border p-3">{detailComment.date}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              删除评论
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentManagement;