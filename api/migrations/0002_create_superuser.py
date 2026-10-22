from django.db import migrations


def create_superuser(apps, schema_editor):
    from django.contrib.auth.models import User

    username = 'Anjara'
    password = 'Admin@2026!'
    email = 'andriafinaritra214@gmail.com'

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]