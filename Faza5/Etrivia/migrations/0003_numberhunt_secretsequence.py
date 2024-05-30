# Generated by Django 4.2.12 on 2024-05-14 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Etrivia', '0002_alter_questionsll_prompt'),
    ]

    operations = [
        migrations.CreateModel(
            name='NumberHunt',
            fields=[
                ('idhunt', models.AutoField(db_column='IdHunt', primary_key=True, serialize=False)),
                ('goal_number', models.IntegerField(db_column='GoalNumber')),
                ('number1', models.IntegerField(db_column='Number1')),
                ('number2', models.IntegerField(db_column='Number2')),
                ('number3', models.IntegerField(db_column='Number3')),
                ('number4', models.IntegerField(db_column='Number4')),
                ('number5', models.IntegerField(db_column='Number5')),
                ('number6', models.IntegerField(db_column='Number6')),
            ],
            options={
                'db_table': 'numberhunt',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='SecretSequence',
            fields=[
                ('idsecret', models.AutoField(db_column='IdSecret', primary_key=True, serialize=False)),
                ('symbol1', models.IntegerField(db_column='Symbol1')),
                ('symbol2', models.IntegerField(db_column='Symbol2')),
                ('symbol3', models.IntegerField(db_column='Symbol3')),
                ('symbol4', models.IntegerField(db_column='Symbol4')),
                ('symbol5', models.IntegerField(db_column='Symbol5')),
                ('symbol6', models.IntegerField(db_column='Symbol6')),
                ('symbol7', models.IntegerField(db_column='Symbol7')),
                ('symbol8', models.IntegerField(db_column='Symbol8')),
            ],
            options={
                'db_table': 'secretsequence',
                'managed': True,
            },
        ),
    ]
