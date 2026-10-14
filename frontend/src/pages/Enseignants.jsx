import React, { useState, useEffect } from 'react';
import { enseignantService } from '../services/api';
import EnseignantForm from '../components/EnseignantForm';

const Enseignants = () => {
    const [enseignants, setEnseignants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedEnseignant, setSelectedEnseignant] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadEnseignants = async () => {
        setLoading(true);
        try {
            const response = await enseignantService.getAll(searchTerm);
            setEnseignants(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEnseignants();
    }, [searchTerm]);

    const handleSearch = () => setSearchTerm(search);
    const handleReset = () => { setSearch(''); setSearchTerm(''); };

    const handleDelete = async (id, nom) => {
        if (!window.confirm(`Supprimer "${nom}" ?`)) return;
        try {
            await enseignantService.delete(id);
            setSuccess(`"${nom}" supprimé`);
            loadEnseignants();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur');
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleEdit = (enseignant) => {
        setSelectedEnseignant(enseignant);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedEnseignant(null);
    };

    const handleFormSuccess = () => {
        handleCloseForm();
        loadEnseignants();
        setSuccess('Opération réussie !');
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div>
            {/* En-tête */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Enseignants</h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>Gérez les enseignants de l'établissement</p>
                </div>
                <button
                    onClick={() => { setSelectedEnseignant(null); setShowForm(true); }}
                    style={{
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    + Nouvel enseignant
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: '10px', color: '#dc2626', marginBottom: '20px', fontSize: '14px' }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '10px', color: '#16a34a', marginBottom: '20px', fontSize: '14px' }}>
                    {success}
                </div>
            )}

            {/* Barre de recherche */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Rechercher un enseignant..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '10px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    Rechercher
                </button>
                {searchTerm && (
                    <button
                        onClick={handleReset}
                        style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Réinitialiser
                    </button>
                )}
            </div>

            {/* Indicateur */}
            <div style={{ marginBottom: '20px', fontSize: '14px', color: '#6b7280' }}>
                {searchTerm ? (
                    <span><strong style={{ color: '#2563eb' }}>{enseignants.length}</strong> résultat(s) pour "{searchTerm}"</span>
                ) : (
                    <span><strong style={{ color: '#2563eb' }}>{enseignants.length}</strong> enseignant(s) au total</span>
                )}
            </div>

            {/* Tableau */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '15px', color: '#6b7280', fontSize: '14px' }}>Chargement...</p>
                    </div>
                ) : enseignants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '14px' }}>
                        {searchTerm ? 'Aucun résultat pour cette recherche' : 'Aucun enseignant trouvé'}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nom complet</th>
                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spécialité</th>
                                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enseignants.map((enseignant) => (
                                <tr
                                    key={enseignant.id_enseignant}
                                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                    <td style={{ padding: '16px 20px', fontSize: '13px', fontFamily: 'monospace', color: '#6b7280' }}>
                                        {enseignant.id_enseignant}
                                    </td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                                        {enseignant.full_name}
                                    </td>
                                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                                        {enseignant.email}
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{
                                            background: '#eff6ff',
                                            color: '#2563eb',
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {enseignant.specialite || 'Non spécifié'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEdit(enseignant)}
                                            style={{
                                                background: '#fef3c7',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                marginRight: '8px',
                                                fontSize: '14px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fde68a'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#fef3c7'}
                                            title="Modifier"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(enseignant.id_enseignant, enseignant.full_name)}
                                            style={{
                                                background: '#fee2e2',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                                            title="Supprimer"
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

            {/* Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                                {selectedEnseignant ? 'Modifier' : 'Ajouter'} un enseignant
                            </h2>
                            <button
                                onClick={handleCloseForm}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#9ca3af',
                                    padding: '4px 8px',
                                    borderRadius: '8px'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <EnseignantForm
                            enseignant={selectedEnseignant}
                            onSuccess={handleFormSuccess}
                            onCancel={handleCloseForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Enseignants;