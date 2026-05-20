const BASE = '/api';

function getToken() {
  return localStorage.getItem('medstudy_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  // auth
  register: (body) => request('/auth/register', { method: 'POST', body, auth: false }),
  login: (body) => request('/auth/login', { method: 'POST', body, auth: false }),
  me: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/me', { method: 'PUT', body }),

  // study
  subjects: () => request('/study/subjects', { auth: false }),
  decks: (subjectId) => request(`/study/decks${subjectId ? `?subjectId=${subjectId}` : ''}`, { auth: false }),
  deck: (id) => request(`/study/decks/${id}`, { auth: false }),
  createDeck: (body) => request('/study/decks', { method: 'POST', body }),
  addCard: (deckId, body) => request(`/study/decks/${deckId}/cards`, { method: 'POST', body }),
  recordSession: (body) => request('/study/sessions', { method: 'POST', body }),

  // leaderboard + milestones
  leaderboard: () => request('/leaderboard', { auth: false }),
  milestones: () => request('/milestones'),

  // questions
  questions: (params = '') => request(`/questions${params}`, { auth: false }),
  question: (id) => request(`/questions/${id}`, { auth: false }),
  askQuestion: (body) => request('/questions', { method: 'POST', body }),
  postAnswer: (id, body) => request(`/questions/${id}/answers`, { method: 'POST', body }),
  vote: (body) => request('/questions/vote', { method: 'POST', body }),
  acceptAnswer: (qid, aid) => request(`/questions/${qid}/accept/${aid}`, { method: 'POST' }),

  // chat
  rooms: () => request('/chat/rooms', { auth: false }),
  roomMessages: (id, after = 0) =>
    request(`/chat/rooms/${id}/messages${after ? `?after=${after}` : ''}`, { auth: false }),
  sendMessage: (id, content) =>
    request(`/chat/rooms/${id}/messages`, { method: 'POST', body: { content } }),
};

export { getToken };
