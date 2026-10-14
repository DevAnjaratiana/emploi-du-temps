import React, { useState, useEffect } from 'react';
import { coursService } from '../services/api';
import CoursForm from '../components/CoursForm';

const Cours = () => {
    const [cours, setCours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedCours, setSelectedCours] = useState(null);
    const [seances, setSeances] = useState(null);
    const [showSeances, setShowSeances] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadCours = async () => {
        setLoading(true);
        try {
            const response = await coursService.getAll(searchTerm);
            setCours(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCours();
    }, [searchTerm]);

    const handleSearch = () => setSearchTerm(search);
    const handleReset = () => { setSearch(''); setSearchTerm(''); };

    const handleDelete = async (id, intitule) => {
        if (!window.confirm(`Supprimer le cours "${intitule}" ?`)) return;
        try {
            await coursService.delete(id);
            setSuccess(`"${intitule}" supprimé`);
            loadCours();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleEdit = (c) => {
        setSelectedCours(c);
        setShowForm(true);
    };

    const handleViewSeances = async (id, intitule) => {
        try {
            const response = await coursService.getSeances(id);
            setSeances({ intitule, data: response.data });
            setShowSeances(true);
        } catch (err) {
            setError('Erreur lors du chargement des séances');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedCours(null);
    };

    const handleFormSuccess = () => {
        handleCloseForm();
        loadCours();
        setSuccess('Opération réussie !');
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* En-tête */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📚 Cours</h1>
                    <p style={{ fontSize: '14px', color: '#666' }}>Gérez les cours de l'établissement</p>
                </div>
                <button
                    onClick={() => { setSelectedCours(null); setShowForm(true); }}
                    style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Nouveau cours
                </button>
            </div>

            {/* Messages */}
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

            {/* Recherche */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Rechercher un cours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
                <button onClick={handleSearch} style={{ padding: '12px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Rechercher
                </button>
                {searchTerm && (
                    <button onClick={handleReset} style={{ padding: '12px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        ✕ Réinitialiser
                    </button>
                )}
            </div>

            {/* Indicateur */}
            <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                {searchTerm ? `${cours.length} résultat(s) pour "${searchTerm}"` : `${cours.length} cours au total`}
            </div>

            {/* Tableau */}
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px' }}>Chargement...</p>
                ) : cours.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        {searchTerm ? 'Aucun résultat' : 'Aucun cours trouvé'}
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Intitulé</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Volume horaire</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#666' }}>Enseignant responsable</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cours.map((c) => (
                                <tr key={c.id_cours} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <td style={{ padding: '12px', fontSize: '13px', fontFamily: 'monospace', color: '#666' }}>{c.id_cours}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>{c.intitule}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{c.volume_horaire ? `${c.volume_horaire}h` : '-'}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>
                                        <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                            {c.enseignant_nom || 'Non assigné'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleViewSeances(c.id_cours, c.intitule)}
                                            style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px', fontWeight: '600' }}
                                        >
                                            Séances
                                        </button>
                                        <button
                                            onClick={() => handleEdit(c)}
                                            style={{ background: '#fef3c7', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px', fontWeight: '600' }}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id_cours, c.intitule)}
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
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '30px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                {selectedCours ? 'Modifier' : 'Ajouter'} un cours
                            </h2>
                            <button onClick={handleCloseForm} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        <CoursForm cours={selectedCours} onSuccess={handleFormSuccess} onCancel={handleCloseForm} />
                    </div>
                </div>
            )}

            {/* Modal Séances du cours */}
            {showSeances && seances && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Séances du cours "{seances.intitule}"</h2>
                            <button onClick={() => setShowSeances(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        {seances.data.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#999' }}>Aucune séance pour ce cours</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {seances.data.map(s => (
                                    <li key={s.id_seance} style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                                        {s.date_seance} : {s.heure_debut} - {s.heure_fin}
                                        <span style={{ marginLeft: '10px', color: '#666' }}>({s.salle_nom})</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cours;