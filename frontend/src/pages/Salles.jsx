import React, { useState, useEffect } from 'react';
import { salleService } from '../services/api';
import SalleForm from '../components/SalleForm';

const Salles = () => {
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedSalle, setSelectedSalle] = useState(null);
    const [occupation, setOccupation] = useState(null);
    const [showOccupation, setShowOccupation] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadSalles = async () => {
        setLoading(true);
        try {
            const response = await salleService.getAll(searchTerm);
            setSalles(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSalles();
    }, [searchTerm]);

    const handleSearch = () => setSearchTerm(search);
    const handleReset = () => { setSearch(''); setSearchTerm(''); };

    const handleViewOccupation = async (id, nom) => {
        try {
            const response = await salleService.getOccupation(id);
            setOccupation(response.data);
            setShowOccupation(true);
        } catch (err) {
            setError('Erreur lors du chargement de l\'occupation');
        }
    };

    const handleDelete = async (id, nom) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer la salle "${nom}" ?`)) return;

        try {
            await salleService.delete(id);
            setSuccess(`Salle "${nom}" supprimée avec succès`);
            loadSalles();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleEdit = (salle) => {
        setSelectedSalle(salle);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedSalle(null);
    };

    const handleFormSuccess = () => {
        handleCloseForm();
        loadSalles();
        setSuccess('Opération réussie !');
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* En-tête */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🏫 Salles</h1>
                    <p style={{ fontSize: '14px', color: '#666' }}>Gérez les salles de l'établissement</p>
                </div>
                <button
                    onClick={() => { setSelectedSalle(null); setShowForm(true); }}
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    + Nouvelle salle
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '12px', borderRadius: '8px', color: '#dc2626', marginBottom: '15px' }}>
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div style={{ background: '#dcfce7', border: '1px solid #86efac', padding: '12px', borderRadius: '8px', color: '#16a34a', marginBottom: '15px' }}>
                    ✅ {success}
                </div>
            )}

            {/* Recherche avec bouton */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Rechercher une salle..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    🔍 Rechercher
                </button>
                {searchTerm && (
                    <button
                        onClick={handleReset}
                        style={{
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ✕ Réinitialiser
                    </button>
                )}
            </div>

            {/* Indicateur */}
            <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                {searchTerm ? `${salles.length} résultat(s) pour "${searchTerm}"` : `${salles.length} salle(s) au total`}
            </div>

            {/* Tableau */}
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid #ddd', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '10px', color: '#666' }}>Chargement...</p>
                    </div>
                ) : salles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        {searchTerm ? 'Aucun résultat pour cette recherche' : 'Aucune salle trouvée'}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Nom</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Capacité</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Équipement</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Occupation</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salles.map((salle) => (
                                <tr key={salle.id_salle} style={{ borderBottom: '1px solid #f5f5f5', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8faff'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={{ padding: '12px', fontSize: '14px', fontFamily: 'monospace' }}>{salle.id_salle}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{salle.nom_salle}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{salle.capacite || '-'}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>{salle.equipement || '-'}</td>
                                    <td style={{ padding: '12px', fontSize: '14px' }}>
                                        <button
                                            onClick={() => handleViewOccupation(salle.id_salle, salle.nom_salle)}
                                            style={{
                                                background: '#22c55e',
                                                color: 'white',
                                                border: 'none',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Voir
                                        </button>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEdit(salle)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                marginRight: '8px',
                                                color: '#999'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#eab308'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                            title="Modifier"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(salle.id_salle, salle.nom_salle)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                color: '#999'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                            title="Supprimer"
                                        >
                                            🗑️
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
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                {selectedSalle ? '✏️ Modifier' : '➕ Ajouter'} une salle
                            </h2>
                            <button
                                onClick={handleCloseForm}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#999'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <SalleForm
                            salle={selectedSalle}
                            onSuccess={handleFormSuccess}
                            onCancel={handleCloseForm}
                        />
                    </div>
                </div>
            )}

            {/* Modal Occupation */}
            {showOccupation && occupation && (
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
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '400px',
                        width: '100%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>📊 Occupation</h2>
                            <button
                                onClick={() => setShowOccupation(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#999'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{occupation.salle}</h3>
                            
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                margin: '20px auto',
                                background: `conic-gradient(#2563eb ${occupation.taux_occupation}, #e5e7eb 0%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                                        {occupation.taux_occupation}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#666' }}>Occupation</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                <p><strong>Total séances :</strong> {occupation.total_seances}</p>
                                <p><strong>Capacité :</strong> {occupation.capacite || 'Non définie'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Salles;