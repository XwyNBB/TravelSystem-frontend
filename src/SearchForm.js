import React, { useState } from 'react';

const SearchForm = ({ onSearch, loading, error }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (start && end) {
      onSearch(start, end);
    } else {
      alert('请输入出发地和目的地');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form flex items-center mb-6">
      <input
        type="text"
        placeholder="出发地"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="px-4 py-2 border rounded-l-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <input
        type="text"
        placeholder="目的地"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="px-4 py-2 border-t border-b border-r-0 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? '搜索中...' : '搜索'}
      </button>
      {error && <p className="ml-4 text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default SearchForm;