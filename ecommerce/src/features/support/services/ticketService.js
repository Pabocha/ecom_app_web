import api from '@/services/api';

export const ticketService = {
  getMyTickets: () => api.get('/v1/support/tickets/'),
  getTicket: (ticketId) => api.get(`/v1/support/tickets/${ticketId}/`),
  createTicket: (data) => api.post('/v1/support/tickets/', data),
  replyTicket: (ticketId, message) =>
    api.post(`/v1/support/tickets/${ticketId}/messages/`, { message }),
};
