import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Enseignants from './pages/Enseignants';
import Salles from './pages/Salles';
import Cours from './pages/Cours';
import Seances from './pages/Seances';

const Sidebar = () => {
    const location = useLocation();
    const menuItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/enseignants', label: 'Enseignants' },
        { path: '/salles', label: 'Salles' },
        { path: '/cours', label: 'Cours' },
        { path: '/seances', label: 'Seances' },
    ];

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
            top: 0
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
        </div>
    );
};

function App() {
    return (
        <Router>
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
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/enseignants" element={<Enseignants />} />
                        <Route path="/salles" element={<Salles />} />
                        <Route path="/cours" element={<Cours />} />
                        <Route path="/seances" element={<Seances />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;