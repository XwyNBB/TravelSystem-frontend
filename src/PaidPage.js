import React, { useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaidPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 模拟订单ID（从URL获取）
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId') || 'ORD123456';

  // 点击"已支付"按钮处理
  const handlePaid = () => {
    setLoading(true);
    setSuccess(true);
    
    // 模拟支付处理延迟
    setTimeout(() => {
      navigate('/user-home', { state: { paymentSuccess: true, orderId } });
    }, 1500);
  };

  // 点击"取消"按钮处理
  const handleCancel = () => {
    // 返回上一页
    navigate(-1);
  };

  return (
    <div className="paid-page container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">订单支付</h1>
        <p className="text-gray-600">订单号: {orderId}</p>
      </div>

      {/* 收款码区域 */}
      <div className="payment-qr-code bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center">请扫描下方二维码支付</h2>
        
        {/* 模拟收款码图片 */}
        <div className="qr-code-container flex justify-center items-center p-6 bg-gray-50 rounded-lg">
          <img 
            src="https://picsum.photos/300/300?random=1" 
            alt="支付二维码" 
            className="w-64 h-64 object-contain"
          />
          <p className="mt-4 text-gray-500">二维码有效期: 10分钟</p>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-700 mb-2">支持微信、支付宝扫码支付</p>
          <p className="text-sm text-gray-500">如遇问题，请联系客服</p>
        </div>
      </div>

      {/* 操作按钮区域 */}
      <div className="buttons-container max-w-md mx-auto">
        <button
          onClick={handlePaid}
          className={`w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium mb-4 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? '处理中...' : '已支付'}
        </button>

        <button
          onClick={handleCancel}
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          取消
        </button>
      </div>

      {/* 支付成功提示（默认隐藏） */}
      {success && !loading && (
        <div className="success-message mt-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
          <p className="font-medium">支付处理中...</p>
          <p className="text-sm mt-1">正在跳转至我的订单页面</p>
        </div>
      )}
    </div>
  );
};

export default PaidPage;