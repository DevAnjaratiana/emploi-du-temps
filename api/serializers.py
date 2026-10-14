from rest_framework import serializers
from .models import Enseignant, Salle, Cours, Seance

class EnseignantSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Enseignant
        fields = ['id_enseignant', 'nom', 'prenom', 'full_name', 'email', 'specialite']


class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = ['id_salle', 'nom_salle', 'capacite', 'equipement']


class CoursSerializer(serializers.ModelSerializer):
    enseignant_nom = serializers.ReadOnlyField(source='enseignant.full_name')
    
    class Meta:
        model = Cours
        fields = ['id_cours', 'intitule', 'volume_horaire', 'enseignant', 'enseignant_nom']


class SeanceSerializer(serializers.ModelSerializer):
    enseignant_nom = serializers.ReadOnlyField(source='enseignant.full_name')
    salle_nom = serializers.ReadOnlyField(source='salle.nom_salle')
    cours_intitule = serializers.ReadOnlyField(source='cours.intitule')
    
    class Meta:
        model = Seance
        fields = [
            'id_seance', 'date_seance', 'heure_debut', 'heure_fin',
            'enseignant', 'enseignant_nom',
            'salle', 'salle_nom',
            'cours', 'cours_intitule'
        ]