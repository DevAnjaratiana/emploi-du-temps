const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function loginRequest(username, password) {
  const res = await fetch(`${API_URL}/api/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Erreur de connexion');
  }
  return res.json();
}

export async function logoutRequest() {
  const refresh = localStorage.getItem('refresh');
  const access = localStorage.getItem('access');
  try {
    await fetch(`${API_URL}/api/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ refresh }),
    });
  } catch (_) {
    // on ignore les erreurs réseau
  }
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem('access');
}

export function isAdmin() {
  const user = getCurrentUser();
  return !!(user?.is_staff || user?.is_superuser);
}

export { API_URL };