# Generated by Django 5.0.6 on 2024-05-25 23:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Etrivia', '0011_game_finished'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_banned',
            field=models.BooleanField(default=False),
        ),
    ]