/**
 * Centralized API Client for Campus Skill Exchange (4S)
 * 
 * Interacts directly with the Node.js/SQLite REST API backend (PORT 3000).
 * Matches all endpoints defined in `skill-exchange-backend/server.js`.
 */

// Base URL resolution: honors Vite environment variables with localhost fallback
let API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL)) ||
  'http://localhost:3000/api';

/**
 * Configure the base API URL dynamically at runtime
 * @param {string} url - New base URL (e.g., 'http://localhost:3000/api')
 */
export function setApiBaseUrl(url) {
  API_BASE_URL = url.replace(/\/+$/, '');
}

/**
 * Get current API base URL
 * @returns {string}
 */
export function getApiBaseUrl() {
  return API_BASE_URL;
}

/**
 * Helper to normalize student IDs (accepts numeric `1` or string `"STU001"` / `"STU1"`)
 * Returns the numeric ID expected by SQLite INTEGER PRIMARY KEY endpoints
 * @param {string|number} id
 * @returns {string|number}
 */
export function normalizeStudentId(id) {
  if (id === null || id === undefined) return id;
  if (typeof id === 'number') return id;
  const str = String(id).trim();
  const match = str.match(/^STU[-_]?(\d+)$/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return str;
}

/**
 * Custom error class capturing HTTP status code and server error response
 */
export class ApiClientError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Core HTTP request handler
 * @param {string} endpoint - Path relative to API_BASE_URL (e.g. '/students/1')
 * @param {object} options - Fetch options (method, headers, body, params)
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const { params, headers, body, ...customConfig } = options;

  let url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (body !== undefined && body !== null) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiClientError(0, `Network error: Unable to connect to backend at ${url}. ${networkError.message}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === 'object' && data.error) ||
      `Request failed with status ${response.status} (${response.statusText})`;
    throw new ApiClientError(response.status, errorMessage, data);
  }

  return data;
}

// -------------------------------------------------------------
// 1. Health & Status
// -------------------------------------------------------------
export const systemApi = {
  checkHealth: () => request('/health'),
};

// -------------------------------------------------------------
// 2. Auth & Student Profiles
// -------------------------------------------------------------
export const authApi = {
  /**
   * Register a new student account
   * @param {object} data - { name, email, password, department?, year?, bio?, hostelBlock?, roomNo? }
   */
  register: (data) => request('/register', { method: 'POST', body: data }),

  /**
   * Login student with email and password
   * @param {object} credentials - { email, password }
   */
  login: (credentials) => request('/login', { method: 'POST', body: credentials }),
};

export const studentsApi = {
  /**
   * List all registered students (summary)
   */
  getAll: () => request('/students'),

  /**
   * Get hydrated student profile with offered/wanted skills & stats
   * @param {string|number} studentId
   */
  getById: (studentId) => request(`/students/${normalizeStudentId(studentId)}`),

  /**
   * Update student profile information
   * @param {string|number} studentId
   * @param {object} data - { name?, email?, department?, year?, bio?, hostelBlock?, roomNo? }
   */
  update: (studentId, data) =>
    request(`/students/${normalizeStudentId(studentId)}`, { method: 'PATCH', body: data }),
};

// -------------------------------------------------------------
// 3. Skills Catalog & Campus Explorer
// -------------------------------------------------------------
export const skillsApi = {
  /**
   * List all master skills, optionally filtered by category
   * @param {string} [category]
   */
  getAll: (category) => request('/skills', { params: { category } }),

  /**
   * Add a new master skill to the catalog
   * @param {object} data - { skillName, category? }
   */
  create: (data) => request('/skills', { method: 'POST', body: data }),

  /**
   * Explore campus skills offered by peers with mentor cards
   * @param {object} [filters] - { category?: string, q?: string }
   */
  explore: (filters = {}) => request('/explore', { params: filters }),
};

// -------------------------------------------------------------
// 4. Offered Skills (Teaching)
// -------------------------------------------------------------
export const offeredSkillsApi = {
  /**
   * Get skills a student teaches
   * @param {string|number} studentId
   */
  getByStudent: (studentId) => request(`/students/${normalizeStudentId(studentId)}/offered`),

  /**
   * Offer to teach a skill (creates or updates offering)
   * @param {string|number} studentId
   * @param {object} data - { skillId? OR skillName?, category?, level?, description?, availability? }
   */
  add: (studentId, data) =>
    request(`/students/${normalizeStudentId(studentId)}/offered`, { method: 'POST', body: data }),

  /**
   * Update an existing offered skill
   * @param {string|number} studentId
   * @param {number} skillId
   * @param {object} data - { skillName?, category?, level?, description?, availability? }
   */
  update: (studentId, skillId, data) =>
    request(`/students/${normalizeStudentId(studentId)}/offered/${skillId}`, { method: 'PATCH', body: data }),

  /**
   * Delete an offered skill
   * @param {string|number} studentId
   * @param {number} skillId
   */
  delete: (studentId, skillId) =>
    request(`/students/${normalizeStudentId(studentId)}/offered/${skillId}`, { method: 'DELETE' }),
};

// -------------------------------------------------------------
// 5. Wanted Skills (Learning Requests & Wishlist)
// -------------------------------------------------------------
export const wantedSkillsApi = {
  /**
   * Get learning wishlist for a student
   * @param {string|number} studentId
   */
  getByStudent: (studentId) => request(`/students/${normalizeStudentId(studentId)}/wanted`),

  /**
   * Get learning requests (alias for wanted skills)
   * @param {string|number} studentId
   */
  getRequests: (studentId) => request(`/students/${normalizeStudentId(studentId)}/requests`),

  /**
   * Add a skill to the learning wishlist
   * @param {string|number} studentId
   * @param {object} data - { skillId? OR skillName?, category?, level?, priority?, description? }
   */
  add: (studentId, data) =>
    request(`/students/${normalizeStudentId(studentId)}/wanted`, { method: 'POST', body: data }),

  /**
   * Update learning wishlist entry
   * @param {string|number} studentId
   * @param {number} skillId
   * @param {object} data - { level?, priority?, description? }
   */
  update: (studentId, skillId, data) =>
    request(`/students/${normalizeStudentId(studentId)}/wanted/${skillId}`, { method: 'PATCH', body: data }),

  /**
   * Remove a skill from learning wishlist
   * @param {string|number} studentId
   * @param {number} skillId
   */
  delete: (studentId, skillId) =>
    request(`/students/${normalizeStudentId(studentId)}/wanted/${skillId}`, { method: 'DELETE' }),
};

// -------------------------------------------------------------
// 6. Peer Matching Engine
// -------------------------------------------------------------
export const matchesApi = {
  /**
   * Get peer matches for the student (prioritizes mutual skill swaps and same hostel)
   * @param {string|number} studentId
   */
  getMatches: (studentId) => request(`/students/${normalizeStudentId(studentId)}/matches`),
};

// -------------------------------------------------------------
// 7. Skill Exchanges
// -------------------------------------------------------------
export const exchangesApi = {
  /**
   * Request a new skill exchange
   * @param {object} data - { teacherId, learnerId, skillId, note? }
   */
  create: (data) =>
    request('/exchanges', {
      method: 'POST',
      body: {
        teacherId: normalizeStudentId(data.teacherId),
        learnerId: normalizeStudentId(data.learnerId),
        skillId: data.skillId,
        note: data.note,
      },
    }),

  /**
   * List exchanges filtered by student or status
   * @param {object} [filters] - { studentId?: string|number, status?: string }
   */
  getAll: (filters = {}) => {
    const params = { ...filters };
    if (params.studentId) {
      params.studentId = normalizeStudentId(params.studentId);
    }
    return request('/exchanges', { params });
  },

  /**
   * Get single exchange by ID
   * @param {number} exchangeId
   */
  getById: (exchangeId) => request(`/exchanges/${exchangeId}`),

  /**
   * Update exchange status (Pending -> Accepted/Rejected/Cancelled; Accepted -> Completed/Cancelled)
   * @param {number} exchangeId
   * @param {string} status - 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed'
   */
  updateStatus: (exchangeId, status) =>
    request(`/exchanges/${exchangeId}/status`, { method: 'PATCH', body: { status } }),
};

// -------------------------------------------------------------
// 8. Study Sessions
// -------------------------------------------------------------
export const sessionsApi = {
  /**
   * Get all sessions for an exchange
   * @param {number} exchangeId
   */
  getByExchange: (exchangeId) => request(`/exchanges/${exchangeId}/sessions`),

  /**
   * Schedule a session for an existing accepted exchange
   * @param {number} exchangeId
   * @param {object} data - { sessionDate, startTime?, durationMins?, topic?, mode?, location? }
   */
  createForExchange: (exchangeId, data) =>
    request(`/exchanges/${exchangeId}/sessions`, { method: 'POST', body: data }),

  /**
   * Get all study sessions for a student (both taught and attended)
   * @param {string|number} studentId
   */
  getByStudent: (studentId) => request(`/students/${normalizeStudentId(studentId)}/sessions`),

  /**
   * Direct 1-step session booking (automatically creates or accepts exchange if needed)
   * @param {object} data - { teacherId, learnerId, skillId, sessionDate, startTime?, durationMins?, topic?, mode?, location? }
   */
  bookSession: (data) =>
    request('/sessions', {
      method: 'POST',
      body: {
        ...data,
        teacherId: normalizeStudentId(data.teacherId),
        learnerId: normalizeStudentId(data.learnerId),
      },
    }),

  /**
   * Update session details or transition status ('Scheduled' | 'Completed' | 'Cancelled')
   * @param {number|string} sessionId - Numeric ID or "SES-0001"
   * @param {object} data - { status?, topic?, location?, sessionDate?, studentId? }
   */
  update: (sessionId, data) => {
    const rawId = typeof sessionId === 'string' ? sessionId.replace(/^SES-0*/i, '') : sessionId;
    return request(`/sessions/${rawId}`, { method: 'PATCH', body: data });
  },
};

// -------------------------------------------------------------
// 9. Feedback & Reviews
// -------------------------------------------------------------
export const feedbackApi = {
  /**
   * Get feedback entries for a specific exchange
   * @param {number} exchangeId
   */
  getByExchange: (exchangeId) => request(`/exchanges/${exchangeId}/feedback`),

  /**
   * Submit review/feedback for a completed exchange
   * @param {number} exchangeId
   * @param {object} data - { givenBy: studentId, rating: 1-5, comments?: string }
   */
  submit: (exchangeId, data) =>
    request(`/exchanges/${exchangeId}/feedback`, {
      method: 'POST',
      body: {
        ...data,
        givenBy: normalizeStudentId(data.givenBy),
      },
    }),

  /**
   * Get all peer reviews and ratings received by a student
   * @param {string|number} studentId
   */
  getByStudent: (studentId) => request(`/students/${normalizeStudentId(studentId)}/feedback`),
};

// -------------------------------------------------------------
// 10. Weekly Availability
// -------------------------------------------------------------
export const availabilityApi = {
  /**
   * Get weekly availability timetable for a student
   * @param {string|number} studentId
   */
  getByStudent: (studentId) => request(`/students/${normalizeStudentId(studentId)}/availability`),

  /**
   * Save full weekly schedule for a student
   * @param {string|number} studentId
   * @param {Array|object} data - Array of day objects with slots or `{ days: [...] }`
   */
  update: (studentId, data) =>
    request(`/students/${normalizeStudentId(studentId)}/availability`, {
      method: 'PUT',
      body: Array.isArray(data) ? { days: data } : data,
    }),
};

// -------------------------------------------------------------
// 11. Peer Messaging & Conversations
// -------------------------------------------------------------
export const messagesApi = {
  /**
   * List all peer chat conversations for a student
   * @param {string|number} studentId
   */
  getConversations: (studentId) =>
    request(`/students/${normalizeStudentId(studentId)}/conversations`),

  /**
   * Get messages with a specific peer
   * @param {string|number} studentId
   * @param {string|number} peerId
   */
  getConversation: (studentId, peerId) =>
    request(
      `/students/${normalizeStudentId(studentId)}/messages/${normalizeStudentId(peerId)}`
    ),

  /**
   * Send a direct message to a peer
   * @param {object} data - { senderId, receiverId, body }
   */
  sendMessage: (data) =>
    request('/messages', {
      method: 'POST',
      body: {
        senderId: normalizeStudentId(data.senderId),
        receiverId: normalizeStudentId(data.receiverId),
        body: data.body,
      },
    }),

  /**
   * Mark all unread messages from a peer as read
   * @param {string|number} studentId
   * @param {string|number} peerId
   */
  markAsRead: (studentId, peerId) =>
    request(
      `/students/${normalizeStudentId(studentId)}/messages/${normalizeStudentId(peerId)}/read`,
      { method: 'PATCH' }
    ),
};

// -------------------------------------------------------------
// 12. Dashboard Aggregation
// -------------------------------------------------------------
export const dashboardApi = {
  /**
   * Fetch complete consolidated dashboard bundle for active student
   * @param {string|number} studentId
   */
  getDashboard: (studentId) =>
    request(`/students/${normalizeStudentId(studentId)}/dashboard`),
};

// -------------------------------------------------------------
// 13. Reports & DBMS Lab Vivas
// -------------------------------------------------------------
export const reportsApi = {
  /**
   * Top rated peer teachers (GROUP BY / HAVING demo)
   */
  getTopTeachers: () => request('/reports/top-teachers'),

  /**
   * Popular skills ranking (teachers vs learners vs exchanges)
   */
  getPopularSkills: () => request('/reports/popular-skills'),

  /**
   * Summary breakdown of exchange counts by status
   */
  getExchangeSummary: () => request('/reports/exchange-summary'),
};

// -------------------------------------------------------------
// Unified Default API Client
// -------------------------------------------------------------
export const api = {
  setBaseUrl: setApiBaseUrl,
  getBaseUrl: getApiBaseUrl,
  normalizeId: normalizeStudentId,
  system: systemApi,
  auth: authApi,
  students: studentsApi,
  skills: skillsApi,
  offered: offeredSkillsApi,
  wanted: wantedSkillsApi,
  matches: matchesApi,
  exchanges: exchangesApi,
  sessions: sessionsApi,
  feedback: feedbackApi,
  availability: availabilityApi,
  messages: messagesApi,
  dashboard: dashboardApi,
  reports: reportsApi,
};

export default api;
