export const API_BASE_URL = "https://med-remind-backend.onrender.com/api";

const requests = {
  get: async (url) => {
    const token = localStorage.getItem("medremind_token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || "Something went wrong");
    return data;
  },
  
  post: async (url, body) => {
    const token = localStorage.getItem("medremind_token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || "Something went wrong");
    return data;
  },

  put: async (url, body) => {
    const token = localStorage.getItem("medremind_token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || "Something went wrong");
    return data;
  },

  delete: async (url) => {
    const token = localStorage.getItem("medremind_token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || "Something went wrong");
    return data;
  }
};

const Auth = {
  login: (email, password) => requests.post('/auth/login', { email, password }),
  register: (userData) => requests.post('/auth/register', userData),
  googleLogin: (credential) => requests.post('/auth/google', { credential }),
};

const Medications = {
  list: () => requests.get('/medications'),
  create: (medData) => requests.post('/medications', medData),
  update: (id, medData) => requests.put(`/medications/${id}`, medData),
  delete: (id) => requests.delete(`/medications/${id}`),
};

const AI = {
  chat: (message) => requests.post('/chat', { message }), 
};

const Settings = {
  get: () => requests.get('/settings'),
  update: (settingsData) => requests.put('/settings', settingsData),
};

const Doses = {
  log: (doseData) => requests.post('/doses', doseData),
  history: () => requests.get('/doses'),
};

export default { Auth, Medications, Settings, AI, Doses };