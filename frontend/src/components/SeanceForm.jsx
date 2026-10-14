import React, { useState, useEffect } from 'react';
import { seanceService, enseignantService, salleService, coursService } from '../services/api';

const SeanceForm = ({ seance = null, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_seance: seance?.id_seance || '',
        date_seance: seance?.date_seance || '',
        heure_debut: seance?.heure_debut || '08:00',
        heure_fin: seance?.heure_fin || '10:00',
        enseignant: seance?.enseignant || '',
        salle: seance?.salle || '',
        cours: seance?.cours || '',
    });
    const [enseignants, setEnseignants] = useState([]);
    const [salles, setSalles] = useState([]);
    const [cours, setCours] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [ensRes, salleRes, coursRes] = await Promise.all([
                    enseignantService.getAll(),
                    salleService.getAll(),
                    coursService.getAll()
                ]);
                setEnseignants(ensRes.data);
                setSalles(salleRes.data);
                setCours(coursRes.data);
            } catch (err) {
                console.error('Erreur chargement:', err);
            }
        };
        loadData();
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
            if (seance?.id_seance) {
                await seanceService.update(seance.id_seance, formData);
            } else {
                await seanceService.create(formData);
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
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            {/* ZONE SCROLLABLE */}
            <div
                style={{
                    overflowY: 'auto',
                    paddingRight: '8px',
                    flex: 1,
                    minHeight: 0,
                }}
            >
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>ID Séance *</label>
                    <input
                        type="text"
                        name="id_seance"
                        value={formData.id_seance}
                        onChange={handleChange}
                        disabled={!!seance?.id_seance}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: seance?.id_seance ? '#f3f4f6' : 'white', boxSizing: 'border-box' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Date *</label>
                    <input
                        type="date"
                        name="date_seance"
                        value={formData.date_seance}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Heure début *</label>
                        <input
                            type="time"
                            name="heure_debut"
                            value={formData.heure_debut}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Heure fin *</label>
                        <input
                            type="time"
                            name="heure_fin"
                            value={formData.heure_fin}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Enseignant *</label>
                    <select
                        name="enseignant"
                        value={formData.enseignant}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                        required
                    >
                        <option value="">-- Sélectionner --</option>
                        {enseignants.map(e => (
                            <option key={e.id_enseignant} value={e.id_enseignant}>{e.nom} {e.prenom}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Salle *</label>
                    <select
                        name="salle"
                        value={formData.salle}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                        required
                    >
                        <option value="">-- Sélectionner --</option>
                        {salles.map(s => (
                            <option key={s.id_salle} value={s.id_salle}>{s.nom_salle}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>Cours *</label>
                    <select
                        name="cours"
                        value={formData.cours}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                        required
                    >
                        <option value="">-- Sélectionner --</option>
                        {cours.map(c => (
                            <option key={c.id_cours} value={c.id_cours}>{c.intitule}</option>
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
            </div>

            {/* FOOTER FIXE : BOUTONS ANNULER / MODIFIER */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    paddingTop: '15px',
                    marginTop: '10px',
                    borderTop: '1px solid #e5e7eb',
                    flexShrink: 0,
                    background: 'white',
                }}
            >
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                    {loading ? 'Chargement...' : (seance?.id_seance ? 'Modifier' : 'Ajouter')}
                </button>
            </div>
        </form>
    );
};

export default SeanceForm;