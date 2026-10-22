from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from datetime import date, timedelta
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Enseignant, Salle, Cours, Seance
from .serializers import (
    EnseignantSerializer, SalleSerializer,
    CoursSerializer, SeanceSerializer
)

# ============ DASHBOARD ============
@api_view(['GET'])
def dashboard_stats(request):
    return Response({
        'enseignants': Enseignant.objects.count(),
        'salles': Salle.objects.count(),
        'cours': Cours.objects.count(),
        'seances': Seance.objects.count(),
    })


@api_view(['GET'])
def dashboard_seances_par_jour(request):
    aujourd_hui = date.today()
    il_y_a_14_jours = aujourd_hui - timedelta(days=13)
    
    seances = Seance.objects.filter(
        date_seance__gte=il_y_a_14_jours,
        date_seance__lte=aujourd_hui
    ).values('date_seance').annotate(total=Count('id_seance')).order_by('date_seance')
    
    # Créer un dictionnaire des résultats
    resultats = {str(s['date_seance']): s['total'] for s in seances}
    
    # Remplir les 14 derniers jours
    data = []
    for i in range(14):
        jour = il_y_a_14_jours + timedelta(days=i)
        data.append({
            'date': jour.strftime('%d/%m'),
            'seances': resultats.get(str(jour), 0)
        })
    
    return Response(data)


@api_view(['GET'])
def dashboard_occupation_salles(request):
    salles = Salle.objects.all()
    data = []
    for salle in salles:
        total = salle.seance_set.count()
        data.append({
            'nom': salle.nom_salle,
            'seances': total,
        })
    return Response(data)


@api_view(['GET'])
def dashboard_seances_par_enseignant(request):
    enseignants = Enseignant.objects.annotate(
        total_seances=Count('seance_set')
    ).filter(total_seances__gt=0).order_by('-total_seances')[:10]
    
    data = []
    for ens in enseignants:
        data.append({
            'nom': f"{ens.nom} {ens.prenom}",
            'seances': ens.total_seances,
        })
    return Response(data)


@api_view(['GET'])
def dashboard_seances_du_jour(request):
    aujourd_hui = date.today()
    seances = Seance.objects.filter(date_seance=aujourd_hui).order_by('heure_debut')
    
    data = []
    for s in seances:
        data.append({
            'id': s.id_seance,
            'heure_debut': s.heure_debut.strftime('%H:%M'),
            'heure_fin': s.heure_fin.strftime('%H:%M'),
            'cours': s.cours.intitule if s.cours else '',
            'enseignant': f"{s.enseignant.nom} {s.enseignant.prenom}" if s.enseignant else '',
            'salle': s.salle.nom_salle if s.salle else '',
        })
    return Response(data)

# ============ ENSEIGNANT ============
class EnseignantViewSet(viewsets.ModelViewSet):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer

    def get_queryset(self):
        queryset = Enseignant.objects.all()
        search = self.request.query_params.get('search', None)
        if search and search.strip():
            queryset = queryset.filter(
                Q(nom__icontains=search) |
                Q(prenom__icontains=search) |
                Q(specialite__icontains=search) |
                Q(email__icontains=search)
            )
        return queryset

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        enseignant = self.get_object()
        serializer = self.get_serializer(enseignant)
        cours = enseignant.cours_set.all().values('id_cours', 'intitule', 'volume_horaire')
        seances = enseignant.seance_set.all().values(
            'id_seance', 'date_seance', 'heure_debut', 'heure_fin',
            'cours__intitule', 'salle__nom_salle'
        )
        return Response({
            'enseignant': serializer.data,
            'cours': list(cours),
            'seances': list(seances)
        })


# ============ SALLE ============
class SalleViewSet(viewsets.ModelViewSet):
    queryset = Salle.objects.all()
    serializer_class = SalleSerializer

    def get_queryset(self):
        queryset = Salle.objects.all()
        search = self.request.query_params.get('search', None)
        if search and search.strip():
            queryset = queryset.filter(
                Q(nom_salle__icontains=search) |
                Q(equipement__icontains=search)
            )
        return queryset

    @action(detail=True, methods=['get'], url_path='occupation')
    def get_occupation(self, request, pk=None):
        salle = self.get_object()
        total_seances = salle.seance_set.count()
        taux = min(total_seances * 10, 100)
        return Response({
            'salle': salle.nom_salle,
            'total_seances': total_seances,
            'taux_occupation': f"{taux}%",
            'capacite': salle.capacite or 'Non définie'
        })


# ============ COURS ============
class CoursViewSet(viewsets.ModelViewSet):
    queryset = Cours.objects.all()
    serializer_class = CoursSerializer

    def get_queryset(self):
        queryset = Cours.objects.all()
        search = self.request.query_params.get('search', None)
        if search and search.strip():
            queryset = queryset.filter(
                Q(intitule__icontains=search) |
                Q(enseignant__nom__icontains=search) |
                Q(enseignant__prenom__icontains=search)
            )
        return queryset

    @action(detail=True, methods=['get'])
    def seances(self, request, pk=None):
        cours = self.get_object()
        seances = cours.seance_set.all()
        serializer = SeanceSerializer(seances, many=True)
        return Response(serializer.data)
    
# ============ SEANCE ============
class SeanceViewSet(viewsets.ModelViewSet):
    queryset = Seance.objects.all()
    serializer_class = SeanceSerializer

    def get_queryset(self):
        queryset = Seance.objects.all()
        enseignant = self.request.query_params.get('enseignant', None)
        salle = self.request.query_params.get('salle', None)
        cours = self.request.query_params.get('cours', None)
        date_seance = self.request.query_params.get('date', None)
        if enseignant:
            queryset = queryset.filter(enseignant__id_enseignant=enseignant)
        if salle:
            queryset = queryset.filter(salle__id_salle=salle)
        if cours:
            queryset = queryset.filter(cours__id_cours=cours)
        if date_seance:
            queryset = queryset.filter(date_seance=date_seance)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        enseignant_id = data.get('enseignant')
        salle_id = data.get('salle')
        date_seance = data.get('date_seance')
        heure_debut = data.get('heure_debut')
        heure_fin = data.get('heure_fin')

        # Vérifier conflit enseignant
        conflit_enseignant = Seance.objects.filter(
            enseignant__id_enseignant=enseignant_id,
            date_seance=date_seance,
            heure_debut__lt=heure_fin,
            heure_fin__gt=heure_debut
        ).exists()

        if conflit_enseignant:
            return Response(
                {'error': 'Cet enseignant est déjà occupé à ce créneau'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier conflit salle
        conflit_salle = Seance.objects.filter(
            salle__id_salle=salle_id,
            date_seance=date_seance,
            heure_debut__lt=heure_fin,
            heure_fin__gt=heure_debut
        ).exists()

        if conflit_salle:
            return Response(
                {'error': 'Cette salle est déjà réservée à ce créneau'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        data = request.data
        enseignant_id = data.get('enseignant')
        salle_id = data.get('salle')
        date_seance = data.get('date_seance')
        heure_debut = data.get('heure_debut')
        heure_fin = data.get('heure_fin')
        instance_id = kwargs.get('pk')

        # Vérifier conflit enseignant (sauf pour la séance en cours de modification)
        conflit_enseignant = Seance.objects.filter(
            enseignant__id_enseignant=enseignant_id,
            date_seance=date_seance,
            heure_debut__lt=heure_fin,
            heure_fin__gt=heure_debut
        ).exclude(id_seance=instance_id).exists()

        if conflit_enseignant:
            return Response(
                {'error': 'Cet enseignant est déjà occupé à ce créneau'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Vérifier conflit salle (sauf pour la séance en cours de modification)
        conflit_salle = Seance.objects.filter(
            salle__id_salle=salle_id,
            date_seance=date_seance,
            heure_debut__lt=heure_fin,
            heure_fin__gt=heure_debut
        ).exclude(id_seance=instance_id).exists()

        if conflit_salle:
            return Response(
                {'error': 'Cette salle est déjà réservée à ce créneau'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().update(request, *args, **kwargs)



# ============ AUTHENTIFICATION ============
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class LoginView(APIView):
    """
    POST /api/login/
    Body: { "username": "...", "password": "..." }
    """
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Username et password requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'detail': 'Identifiants invalides'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        })


class LogoutView(APIView):
    """
    POST /api/logout/
    Body: { "refresh": "..." }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'detail': 'Refresh token requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Déconnecté avec succès'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'detail': 'Token invalide'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """
    GET /api/me/ — infos de l'utilisateur connecté
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })