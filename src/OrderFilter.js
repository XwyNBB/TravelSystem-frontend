import React from 'react';

const OrderFilter = ({ currentStatus, onFilter, loading }) => {
  const statusOptions = [
    { value: 'all', label: '全部订单' },
    { value: 'unpaid', label: '未支付' },
    { value: 'unused', label: '未使用' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ];

  return (
    <div className="order-filter flex mb-6 overflow-x-auto pb-2">
      {statusOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilter(option.value)}
          className={`px-4 py-2 mr-2 rounded-md ${
            currentStatus === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default OrderFilter;