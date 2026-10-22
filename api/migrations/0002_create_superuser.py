# api/migrations/0002_create_superuser.py
from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    username = os.environ.get('ADMIN_USERNAME', 'Anjara')
    password = os.environ.get('ADMIN_PASSWORD', '123')
    email = os.environ.get('ADMIN_EMAIL', 'andriafinaritra214@gmail.com')

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),  # ⬅️ Vérifie le nom exact de ta migration existante
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]