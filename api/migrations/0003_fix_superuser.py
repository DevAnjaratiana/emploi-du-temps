from django.db import migrations


def fix_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    username = 'Anjara'
    password = 'Admin@2026!'   # ⬅️ mot de passe SOLIDE (Django l'accepte)
    email = 'andriafinaritra214@gmail.com'

    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email,
            'is_staff': True,
            'is_superuser': True,
        }
    )
    user.set_password(password)   # ⬅️ set_password hash le mot de passe correctement
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