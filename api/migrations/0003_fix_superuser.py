from django.db import migrations


def fix_superuser(apps, schema_editor):
    # ⬇️ On utilise le VRAI modèle User, pas le modèle historique
    from django.contrib.auth.models import User

    user, created = User.objects.get_or_create(
        username='Anjara',
        defaults={
            'email': 'andriafinaritra214@gmail.com',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    user.set_password('Admin@2026!')
    user.is_staff = True
    user.is_superuser = True
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_create_superuser'),
    ]

    operations = [
        migrations.RunPython(fix_superuser),
    ]