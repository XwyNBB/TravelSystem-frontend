import React from 'react';

const PlanFilter = ({ sortOption, onSortChange }) => {
  const sortOptions = [
    { value: 'price-asc', label: '价格从低到高' },
    { value: 'price-desc', label: '价格从高到低' },
    { value: 'days-asc', label: '行程天数从少到多' },
    { value: 'days-desc', label: '行程天数从多到少' },
    { value: 'popularity-desc', label: '热门程度' }
  ];

  return (
    <div className="sort-buttons mb-6 flex flex-wrap gap-2">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`px-4 py-2 rounded-md ${
            sortOption === option.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors duration-200`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PlanFilter;