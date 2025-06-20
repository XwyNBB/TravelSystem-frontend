// import axios from 'axios';

// // 创建axios实例，设置基础URL和默认配置
// const api = axios.create({
//   baseURL: 'http://localhost:8080/api', // 后端API基础地址
//   timeout: 10000, // 请求超时时间
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // order管理API
// export const orderAPI = {
//   // 获取订单列表
//   getOrders: () => api.get('/orders'),
  
//   getOrdersByAccount: (account) => api.get(`/orders/${account}`),

//   // 获取单个订单详情
//   getOrderById: (id) => api.get(`/orders/${id}`),
  
//   // 创建新订单
//   createOrder: (orderData) => api.post('/orders', orderData),
  
//   // 更新订单
//   updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  
//   // 处理订单
//   processOrder: (id) => api.patch(`/orders/${id}/process`),
  
//   // 取消订单
//   cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
// };

// // plan管理API
// export const planAPI = {
//   // 获取行程列表
//   getPlans: () => api.get('/plans'),
  
//   // 获取单个行程详情
//   getPlanById: (id) => api.get(`/plans/${id}`),
  
//   // 更新行程
//   updatePlan: (id, planData) => api.put(`/plans/${id}`, planData),
  
//   // 切换行程状态
//   togglePlanStatus: (id) => api.patch(`/plans/${id}/status`),
// };

// // comment管理API
// export const commentAPI = {
//   // 获取评论列表
//   getComments: () => api.get('/comments'),
  
//   // 删除评论
//   deleteComment: (id) => api.delete(`/comments/${id}`),
// };

// // userInfo管理API
// export const userInfoAPI = {
//     // 获取用户信息
//     getUserInfo: (userId) => api.get(`/users/${userId}`),
//     // 更新用户信息
//     updateUserInfo: (userId, userData) => api.put(`/users/${userId}`, userData),
// //    登录请求
//     login: (credentials) => api.post('/login', credentials
// }

// export default api;