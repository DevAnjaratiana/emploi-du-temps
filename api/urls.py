from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EnseignantViewSet, SalleViewSet, CoursViewSet, SeanceViewSet,
    dashboard_stats, dashboard_seances_par_jour, dashboard_occupation_salles,
    dashboard_seances_par_enseignant, dashboard_seances_du_jour
)


router = DefaultRouter()
router.register(r'enseignants', EnseignantViewSet, basename='enseignant')
router.register(r'salles', SalleViewSet, basename='salle')
router.register(r'cours', CoursViewSet, basename='cours')
router.register(r'seances', SeanceViewSet, basename='seance')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', dashboard_stats),
    path('dashboard/seances-par-jour/', dashboard_seances_par_jour),
    path('dashboard/occupation-salles/', dashboard_occupation_salles),
    path('dashboard/seances-par-enseignant/', dashboard_seances_par_enseignant),
    path('dashboard/seances-du-jour/', dashboard_seances_du_jour),
]