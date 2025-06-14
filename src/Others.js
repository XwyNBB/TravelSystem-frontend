import React from 'react';

const Others = ({ onContact, onComment, loading }) => {
  return (
    <div className="others flex justify-end mb-8">
      <button
        onClick={onContact}
        className="px-6 py-2 mr-4 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
        disabled={loading}
      >
        联系我们
      </button>
      <button
        onClick={onComment}
        className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
        disabled={loading}
      >
        评论
      </button>
    </div>
  );
};

export default Others;