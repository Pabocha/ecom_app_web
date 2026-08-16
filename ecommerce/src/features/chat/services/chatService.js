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
  sendMessage: (roomId, data) => {
    if (data?.image instanceof File) {
      const form = new FormData();
      if (data.message) form.append('message', data.message);
      form.append('image', data.image);
      if (data.product_id) form.append('product_id', data.product_id);
      if (data.variant_id) form.append('variant_id', data.variant_id);
      if (data.message_type) form.append('message_type', data.message_type);
      return api.post(`/v1/messaging/chats/${roomId}/messages/upload`, form, {
        headers: { 'Content-Type': undefined },
      });
    }
    return api.post(`/v1/messaging/chats/${roomId}/messages/upload`, data);
  },
  markMessagesRead: (roomId, messageIds) =>
    api.post(`/v1/messaging/chats/${roomId}/messages/read`, { message_ids: messageIds }),
};
