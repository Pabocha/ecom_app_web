import api from '@/services/api';

export const chatService = {
  startSupportChat: () => api.post('/v1/messaging/support-chat/start'),
  openChat: (members, productId) =>
    api.post('/v1/messaging/user/chats', {
      members,
      ...(productId ? { product_id: productId } : {}),
    }),
  getConversations: () => api.get('/v1/messaging/user/conversations'),
  getMessages: (roomId) => api.get(`/v1/messaging/chats/${roomId}/messages`),
  sendMessage: (roomId, data) => api.post(`/v1/messaging/chats/${roomId}/messages`, data),
  markMessagesRead: (roomId, messageIds) =>
    api.post(`/v1/messaging/chats/${roomId}/messages/read`, { message_ids: messageIds }),
};
