import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell as PieCell
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ enseignants: 0, salles: 0, cours: 0, seances: 0 });
    const [seancesParJour, setSeancesParJour] = useState([]);
    const [occupationSalles, setOccupationSalles] = useState([]);
    const [seancesParEnseignant, setSeancesParEnseignant] = useState([]);
    const [seancesDuJour, setSeancesDuJour] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            try {
                const [statsRes, jourRes, occRes, ensRes, aujourdRes] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getSeancesParJour(),
                    dashboardService.getOccupationSalles(),
                    dashboardService.getSeancesParEnseignant(),
                    dashboardService.getSeancesDuJour(),
                ]);
                setStats(statsRes.data);
                setSeancesParJour(jourRes.data);
                setOccupationSalles(occRes.data);
                setSeancesParEnseignant(ensRes.data);
                setSeancesDuJour(aujourdRes.data);
            } catch (err) {
                console.error('Erreur dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#dc2626', '#0891b2', '#ca8a04', '#be185d'];

    const cards = [
        { label: 'Enseignants', value: stats.enseignants, color: '#2563eb', bg: '#eff6ff', icon: '👨‍🏫' },
        { label: 'Salles', value: stats.salles, color: '#16a34a', bg: '#f0fdf4', icon: '🏫' },
        { label: 'Cours', value: stats.cours, color: '#9333ea', bg: '#faf5ff', icon: '📚' },
        { label: 'Séances', value: stats.seances, color: '#ea580c', bg: '#fff7ed', icon: '📅' },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '80px' }}>
                <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '20px', color: '#6b7280' }}>Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div>
            {/* En-tête */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>📊 Tableau de bord</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
                    Vue d'ensemble de votre emploi du temps
                </p>
            </div>

            {/* Cartes statistiques */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {cards.map((card, i) => (
                    <div key={i} style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        border: '1px solid #f3f4f6',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {card.label}
                                </p>
                                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginTop: '5px' }}>
                                    {card.value}
                                </p>
                            </div>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: card.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>



            {/* Deux graphiques côte à côte */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Camembert : Occupation des salles */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '5px' }}>
                        🏫 Occupation des salles
                    </h2>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Nombre de séances par salle</p>
                    {occupationSalles.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Aucune donnée</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={occupationSalles}
                                    dataKey="seances"
                                    nameKey="nom"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => entry.nom}
                                >
                                    {occupationSalles.map((entry, index) => (
                                        <PieCell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Barres horizontales : Séances par enseignant */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '5px' }}>
                        👨‍🏫 Séances par enseignant
                    </h2>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>Top 10 des enseignants</p>
                    {seancesParEnseignant.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Aucune donnée</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={seancesParEnseignant} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                                <YAxis type="category" dataKey="nom" width={120} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="seances" fill="#9333ea" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

           
        </div>
    );
};

export default Dashboard;