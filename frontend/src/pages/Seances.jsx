import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { seanceService, enseignantService, salleService, coursService } from '../services/api';
import SeanceForm from '../components/SeanceForm';

const Seances = () => {
    const [seances, setSeances] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [salles, setSalles] = useState([]);
    const [cours, setCours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedSeance, setSelectedSeance] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [filtreEnseignant, setFiltreEnseignant] = useState('');
    const [filtreSalle, setFiltreSalle] = useState('');
    const [filtreCours, setFiltreCours] = useState('');
    const [filtreDate, setFiltreDate] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filtreEnseignant) params.enseignant = filtreEnseignant;
            if (filtreSalle) params.salle = filtreSalle;
            if (filtreCours) params.cours = filtreCours;
            if (filtreDate) params.date = filtreDate;

            const [seancesRes, ensRes, salleRes, coursRes] = await Promise.all([
                seanceService.getAll(params),
                enseignantService.getAll(),
                salleService.getAll(),
                coursService.getAll()
            ]);

            setSeances(seancesRes.data);
            setEnseignants(ensRes.data);
            setSalles(salleRes.data);
            setCours(coursRes.data);
            setError(null);
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filtreEnseignant, filtreSalle, filtreCours, filtreDate]);

    const events = seances.map(s => ({
        id: s.id_seance,
        title: `${s.cours_intitule || 'Cours'}`,
        start: `${s.date_seance}T${s.heure_debut}`,
        end: `${s.date_seance}T${s.heure_fin}`,
        extendedProps: {
            enseignant: s.enseignant_nom,
            salle: s.salle_nom,
            cours: s.cours_intitule,
        },
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
    }));

    const handleDateClick = (info) => {
        const date = info.dateStr.split('T')[0];
        const time = info.dateStr.split('T')[1]?.substring(0, 5) || '08:00';

        setSelectedSeance({
            date_seance: date,
            heure_debut: time,
            heure_fin: '10:00'
        });
        setShowForm(true);
    };

    const handleEventClick = (info) => {
        const seance = seances.find(s => s.id_seance === info.event.id);
        if (seance) {
            setSelectedSeance(seance);
            setShowForm(true);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedSeance(null);
    };

    const handleFormSuccess = () => {
        handleCloseForm();
        loadData();
        setSuccess('Opération réussie !');
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleDeleteSeance = async () => {
        if (!selectedSeance?.id_seance) return;
        if (!window.confirm(`Supprimer cette séance ?`)) return;

        try {
            await seanceService.delete(selectedSeance.id_seance);
            handleCloseForm();
            loadData();
            setSuccess('Séance supprimée !');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const handleResetFilters = () => {
        setFiltreEnseignant('');
        setFiltreSalle('');
        setFiltreCours('');
        setFiltreDate('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📅 Séances</h1>
                    <p style={{ fontSize: '14px', color: '#666' }}>Calendrier des séances (cliquez sur un créneau pour ajouter)</p>
                </div>
                <button
                    onClick={() => { setSelectedSeance(null); setShowForm(true); }}
                    style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Nouvelle séance
                </button>
            </div>

            {error && (
                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', color: '#dc2626', marginBottom: '15px' }}>
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '8px', color: '#16a34a', marginBottom: '15px' }}>
                    ✅ {success}
                </div>
            )}

            {/* Filtres */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={filtreEnseignant} onChange={(e) => setFiltreEnseignant(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <option value="">👨‍🏫 Tous les enseignants</option>
                    {enseignants.map(e => <option key={e.id_enseignant} value={e.id_enseignant}>{e.nom} {e.prenom}</option>)}
                </select>
                <select value={filtreSalle} onChange={(e) => setFiltreSalle(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <option value="">🏫 Toutes les salles</option>
                    {salles.map(s => <option key={s.id_salle} value={s.id_salle}>{s.nom_salle}</option>)}
                </select>
                <select value={filtreCours} onChange={(e) => setFiltreCours(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <option value="">📚 Tous les cours</option>
                    {cours.map(c => <option key={c.id_cours} value={c.id_cours}>{c.intitule}</option>)}
                </select>
                <input type="date" value={filtreDate} onChange={(e) => setFiltreDate(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }} />
                <button onClick={handleResetFilters} style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    ✕ Réinitialiser
                </button>
            </div>

            {/* Tableau récapitulatif des séances */}
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                    📋 Liste des séances ({seances.length})
                </h2>

                {seances.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        Aucune séance enregistrée
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Horaire</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Cours</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Enseignant</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Salle</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seances.map(s => (
                                <tr key={s.id_seance} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '12px', fontSize: '13px', fontFamily: 'monospace', color: '#666' }}>{s.id_seance}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{s.date_seance}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{s.heure_debut} - {s.heure_fin}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>{s.cours_intitule}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{s.enseignant_nom}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{s.salle_nom}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => { setSelectedSeance(s); setShowForm(true); }}
                                            style={{ background: '#fef3c7', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px', fontWeight: '600' }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Supprimer cette séance ?')) {
                                                    try {
                                                        await seanceService.delete(s.id_seance);
                                                        loadData();
                                                    } catch (err) {
                                                        alert('Erreur');
                                                    }
                                                }
                                            }}
                                            style={{ background: '#fee2e2', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Formulaire */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    padding: '20px',
                    boxSizing: 'border-box',
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '10px',
                        maxWidth: '500px',
                        width: '100%',
                        height: '95vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                    }}>
                        {/* HEADER fixe avec bouton supprimer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                                {selectedSeance?.id_seance ? '✏️ Modifier' : '➕ Ajouter'} une séance
                            </h2>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {selectedSeance?.id_seance && (
                                    <button
                                        onClick={handleDeleteSeance}
                                        title="Supprimer cette séance"
                                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', padding: '6px 10px', fontWeight: '600' }}
                                    >
                                        🗑️
                                    </button>
                                )}
                                <button onClick={handleCloseForm} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                            </div>
                        </div>

                        {/* Infos séance (si modification) */}
                        {selectedSeance?.id_seance && (
                            <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', flexShrink: 0 }}>
                                <p style={{ margin: '4px 0' }}>👨‍🏫 <strong>{selectedSeance.enseignant_nom}</strong></p>
                                <p style={{ margin: '4px 0' }}>🏫 <strong>{selectedSeance.salle_nom}</strong></p>
                                <p style={{ margin: '4px 0' }}>📚 <strong>{selectedSeance.cours_intitule}</strong></p>
                            </div>
                        )}

                        {/* FORMULAIRE scrollable */}
                        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                            <SeanceForm seance={selectedSeance} onSuccess={handleFormSuccess} onCancel={handleCloseForm} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Seances;