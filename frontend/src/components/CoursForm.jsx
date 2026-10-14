import React, { useState, useEffect } from 'react';
import { coursService, enseignantService } from '../services/api';

const CoursForm = ({ cours = null, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_cours: cours?.id_cours || '',
        intitule: cours?.intitule || '',
        volume_horaire: cours?.volume_horaire || '',
        enseignant: cours?.enseignant || '',
    });
    const [enseignants, setEnseignants] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadEnseignants = async () => {
            try {
                const res = await enseignantService.getAll();
                setEnseignants(res.data);
            } catch (err) {
                console.error('Erreur chargement enseignants:', err);
            }
        };
        loadEnseignants();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (cours) {
                await coursService.update(cours.id_cours, formData);
            } else {
                await coursService.create(formData);
            }
            onSuccess();
        } catch (err) {
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ general: 'Une erreur est survenue' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>ID Cours *</label>
                <input
                    type="text"
                    name="id_cours"
                    value={formData.id_cours}
                    onChange={handleChange}
                    disabled={!!cours}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: cours ? '#f3f4f6' : 'white' }}
                    required
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Intitulé *</label>
                <input
                    type="text"
                    name="intitule"
                    value={formData.intitule}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    required
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Volume horaire</label>
                <input
                    type="number"
                    name="volume_horaire"
                    value={formData.volume_horaire}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Enseignant responsable *</label>
                <select
                    name="enseignant"
                    value={formData.enseignant}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                    required
                >
                    <option value="">-- Sélectionner --</option>
                    {enseignants.map(e => (
                        <option key={e.id_enseignant} value={e.id_enseignant}>{e.nom} {e.prenom}</option>
                    ))}
                </select>
            </div>

            {errors.error && (
                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', color: '#dc2626', marginBottom: '15px' }}>
                    ⚠️ {errors.error}
                </div>
            )}
            {errors.general && (
                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', color: '#dc2626', marginBottom: '15px' }}>
                    ⚠️ {errors.general}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Annuler
                </button>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    {loading ? 'Chargement...' : (cours ? 'Modifier' : 'Ajouter')}
                </button>
            </div>
        </form>
    );
};

export default CoursForm;