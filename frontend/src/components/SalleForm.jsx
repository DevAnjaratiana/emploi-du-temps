import React, { useState } from 'react';
import { salleService } from '../services/api';

const SalleForm = ({ salle = null, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_salle: salle?.id_salle || '',
        nom_salle: salle?.nom_salle || '',
        capacite: salle?.capacite || '',
        equipement: salle?.equipement || '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (salle) {
                await salleService.update(salle.id_salle, formData);
            } else {
                await salleService.create(formData);
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                    ID Salle *
                </label>
                <input
                    type="text"
                    name="id_salle"
                    value={formData.id_salle}
                    onChange={handleChange}
                    disabled={!!salle}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${errors.id_salle ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: salle ? '#f3f4f6' : 'white'
                    }}
                    required
                />
                {errors.id_salle && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.id_salle}</p>}
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                    Nom de la salle *
                </label>
                <input
                    type="text"
                    name="nom_salle"
                    value={formData.nom_salle}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${errors.nom_salle ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                    required
                />
                {errors.nom_salle && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.nom_salle}</p>}
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                    Capacité
                </label>
                <input
                    type="number"
                    name="capacite"
                    value={formData.capacite}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${errors.capacite ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                {errors.capacite && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.capacite}</p>}
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                    Équipement
                </label>
                <input
                    type="text"
                    name="equipement"
                    value={formData.equipement}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${errors.equipement ? '#ef4444' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
                {errors.equipement && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.equipement}</p>}
            </div>

            {errors.general && (
                <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', color: '#dc2626', fontSize: '14px' }}>
                    ⚠️ {errors.general}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '10px 20px',
                        background: '#e5e7eb',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Chargement...' : (salle ? 'Modifier' : 'Ajouter')}
                </button>
            </div>
        </form>
    );
};

export default SalleForm;