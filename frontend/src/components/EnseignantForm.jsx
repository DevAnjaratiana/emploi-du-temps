import React, { useState } from 'react';
import { enseignantService } from '../services/api';

const EnseignantForm = ({ enseignant = null, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_enseignant: enseignant?.id_enseignant || '',
        nom: enseignant?.nom || '',
        prenom: enseignant?.prenom || '',
        email: enseignant?.email || '',
        specialite: enseignant?.specialite || '',
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
            if (enseignant) {
                await enseignantService.update(enseignant.id_enseignant, formData);
            } else {
                await enseignantService.create(formData);
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
                <label className="block text-sm font-medium text-gray-700 mb-1">ID *</label>
                <input
                    type="text"
                    name="id_enseignant"
                    value={formData.id_enseignant}
                    onChange={handleChange}
                    disabled={!!enseignant}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        enseignant ? 'bg-gray-100' : ''
                    } ${errors.id_enseignant ? 'border-red-500' : 'border-gray-300'}`}
                    required
                />
                {errors.id_enseignant && <p className="text-red-500 text-sm mt-1">{errors.id_enseignant}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <input
                    type="text"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors.general}
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                    {loading ? 'Chargement...' : (enseignant ? 'Modifier' : 'Ajouter')}
                </button>
            </div>
        </form>
    );
};

export default EnseignantForm;