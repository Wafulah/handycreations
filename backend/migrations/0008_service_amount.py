# Generated by Django 4.1.6 on 2023-06-07 22:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_alter_aggregateddata_total_profit'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
            preserve_default=False,
        ),
    ]
