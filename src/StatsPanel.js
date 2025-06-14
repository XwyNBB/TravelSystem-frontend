import React, { useState, useEffect } from 'react';

const StatsPanel = ({ statsData, loading, error }) => {
  return (
    <div className="stats-panel">
      {loading && <p className="text-center text-gray-500">加载中...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {!loading && !error && (
        <>
          <h2 className="text-xl font-semibold mb-4">数据概览</h2>
          
          {/* 热门行程 */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3">热门行程 (前10)</h3>
            <div className="bg-white p-4 rounded-lg border">
              {statsData.popularPlans.map((plan, index) => (
                <div key={plan.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span>{plan.title}</span>
                  <span className="font-medium">{plan.orderCount} 单</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 赚钱行程 */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3">赚钱行程 (前10)</h3>
            <div className="bg-white p-4 rounded-lg border">
              {statsData.profitablePlans.map((plan, index) => (
                <div key={plan.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span>{plan.title}</span>
                  <span className="font-medium">¥{plan.revenue}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 热门地点 */}
          <div>
            <h3 className="font-semibold text-lg mb-3">热门地点 (前10)</h3>
            <div className="bg-white p-4 rounded-lg border">
              {statsData.popularLocations.map((location, index) => (
                <div key={location.city} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span>{location.city}</span>
                  <span className="font-medium">{location.count} 单</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPanel;