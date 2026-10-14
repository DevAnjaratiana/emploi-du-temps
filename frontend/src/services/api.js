import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============ SERVICE ENSEIGNANT ============
export const enseignantService = {
    getAll: (search = '') => api.get(`/enseignants/?search=${search}`),
    getById: (id) => api.get(`/enseignants/${id}/`),
    getDetails: (id) => api.get(`/enseignants/${id}/details/`),
    create: (data) => api.post('/enseignants/', data),
    update: (id, data) => api.put(`/enseignants/${id}/`, data),
    delete: (id) => api.delete(`/enseignants/${id}/`),
};

// ============ SERVICE SALLE ============
export const salleService = {
    getAll: (search = '') => api.get(`/salles/?search=${search}`),
    getById: (id) => api.get(`/salles/${id}/`),
    getOccupation: (id) => api.get(`/salles/${id}/occupation/`),
    create: (data) => api.post('/salles/', data),
    update: (id, data) => api.put(`/salles/${id}/`, data),
    delete: (id) => api.delete(`/salles/${id}/`),
};

// ============ SERVICE COURS ============
export const coursService = {
    getAll: (search = '') => api.get(`/cours/?search=${search}`),
    getById: (id) => api.get(`/cours/${id}/`),
    getSeances: (id) => api.get(`/cours/${id}/seances/`),
    create: (data) => api.post('/cours/', data),
    update: (id, data) => api.put(`/cours/${id}/`, data),
    delete: (id) => api.delete(`/cours/${id}/`),
};

// ============ SERVICE SEANCE ============
export const seanceService = {
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return api.get(`/seances/?${queryParams}`);
    },
    getById: (id) => api.get(`/seances/${id}/`),
    create: (data) => api.post('/seances/', data),
    update: (id, data) => api.put(`/seances/${id}/`, data),
    delete: (id) => api.delete(`/seances/${id}/`),
};

// ============ SERVICE DASHBOARD ============
export const dashboardService = {
    getStats: () => api.get('/dashboard/stats/'),
    getSeancesParJour: () => api.get('/dashboard/seances-par-jour/'),
    getOccupationSalles: () => api.get('/dashboard/occupation-salles/'),
    getSeancesParEnseignant: () => api.get('/dashboard/seances-par-enseignant/'),
    getSeancesDuJour: () => api.get('/dashboard/seances-du-jour/'),
}; 

export default api;