from django.db import models

class Enseignant(models.Model):
    id_enseignant = models.CharField(max_length=50, primary_key=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    specialite = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'Enseignant'
        ordering = ['nom', 'prenom']

    def __str__(self):
        return f"{self.nom} {self.prenom}"

    @property
    def full_name(self):
        return f"{self.nom} {self.prenom}"


class Salle(models.Model):
    id_salle = models.CharField(max_length=50, primary_key=True)
    nom_salle = models.CharField(max_length=50, unique=True)
    capacite = models.IntegerField(null=True, blank=True)
    equipement = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'Salle'
        ordering = ['nom_salle']

    def __str__(self):
        return self.nom_salle


class Cours(models.Model):
    id_cours = models.CharField(max_length=50, primary_key=True)
    intitule = models.CharField(max_length=50, null=True, blank=True)
    volume_horaire = models.IntegerField(null=True, blank=True)
    enseignant = models.ForeignKey(
        Enseignant,
        on_delete=models.RESTRICT,
        related_name='cours_set'
    )

    class Meta:
        db_table = 'Cours'
        ordering = ['intitule']

    def __str__(self):
        return self.intitule or self.id_cours


class Seance(models.Model):
    id_seance = models.CharField(max_length=50, primary_key=True)
    date_seance = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    enseignant = models.ForeignKey(
        Enseignant,
        on_delete=models.RESTRICT,
        related_name='seance_set'
    )
    salle = models.ForeignKey(
        Salle,
        on_delete=models.RESTRICT,
        related_name='seance_set'
    )
    cours = models.ForeignKey(
        Cours,
        on_delete=models.RESTRICT,
        related_name='seance_set'
    )

    class Meta:
        db_table = 'Seance'
        ordering = ['date_seance', 'heure_debut']

    def __str__(self):
        return f"{self.cours} - {self.date_seance}"