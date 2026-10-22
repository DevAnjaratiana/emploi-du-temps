import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Enseignants from './pages/Enseignants';
import Salles from './pages/Salles';
import Cours from './pages/Cours';
import Seances from './pages/Seances';
import Login from './pages/Login';
import AdminRedirect from './pages/AdminRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser, isAuthenticated, isAdmin, logoutRequest } from './api/auth';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const user = getCurrentUser();

    const menuItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/enseignants', label: 'Enseignants' },
        { path: '/salles', label: 'Salles' },
        { path: '/cours', label: 'Cours' },
        { path: '/seances', label: 'Seances' },
    ];

    // Si admin, ajouter un lien vers l'admin Django
    if (isAdmin()) {
        menuItems.push({ path: '/admin', label: '⚙️ Admin Django' });
    }

    return (
        <div style={{
            width: '240px',
            background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
            height: '100vh',
            padding: '20px 16px',
            color: 'white',
            flexShrink: 0,
            overflowY: 'auto',
            position: 'sticky',
            top: 0,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '30px', fontSize: '18px' }}>Emploi du Temps</h2>
            {menuItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    style={{
                        display: 'block',
                        padding: '12px 16px',
                        marginBottom: '6px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: location.pathname === item.path ? '600' : '400',
                        background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                        transition: 'all 0.2s'
                    }}
                >
                    {item.label}
                </Link>
            ))}

            {/* Bloc utilisateur + déconnexion en bas */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize: '13px', marginBottom: '8px', opacity: 0.9 }}>
                    👤 {user?.username}
                </p>
                <LogoutButton />
            </div>
        </div>
    );
};

// Petit composant pour gérer la redirection après logout
const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutRequest();
        navigate('/login');
    };
    return (
        <button
            onClick={handleLogout}
            style={{
                width: '100%',
                padding: '10px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
            }}
        >
            Déconnexion
        </button>
    );
};

// Layout pour les pages internes (sidebar + contenu)
const MainLayout = ({ children }) => (
    <div style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#f8fafc',
        margin: 0,
        padding: 0
    }}>
        <Sidebar />
        <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100vh',
            boxSizing: 'border-box'
        }}>
            {children}
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Route publique */}
                <Route path="/login" element={<Login />} />

                {/* Route admin Django (redirection) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminRedirect />
                        </ProtectedRoute>
                    }
                />

                {/* Routes protégées avec sidebar */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout><Dashboard /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/enseignants"
                    element={
                        <ProtectedRoute>
                            <MainLayout><Enseignants /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/salles"
                    element={
                        <ProtectedRoute>
                            <MainLayout><Salles /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cours"
                    element={
                        <ProtectedRoute>
                            <MainLayout><Cours /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/seances"
                    element={
                        <ProtectedRoute>
                            <MainLayout><Seances /></MainLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;