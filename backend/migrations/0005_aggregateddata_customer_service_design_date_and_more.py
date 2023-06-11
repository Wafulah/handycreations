# Generated by Django 4.1.6 on 2023-06-07 09:33

import datetime
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_alter_home_id_alter_interiordesign_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='AggregatedData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_customers', models.IntegerField(default=0)),
                ('total_orders', models.IntegerField(default=0)),
                ('total_budget', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('total_profit', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('profit_per_service', models.JSONField(default=list)),
                ('percentage_delivered', models.DecimalField(decimal_places=2, default=0, max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('location', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=20)),
                ('signed_up', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='design',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='design',
            name='featured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='home',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='home',
            name='featured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='interiordesign',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='interiordesign',
            name='featured',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('order_number', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField(default=datetime.date.today)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('DELIVERED', 'Delivered'), ('REFUNDED', 'Refunded')], max_length=20)),
                ('payment_status', models.CharField(choices=[('PAID_FULL', 'Paid in Full'), ('PAID_PARTIAL', 'Paid Partially'), ('NOT_PAID', 'Not Paid')], max_length=20)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('profit', models.DecimalField(decimal_places=2, max_digits=10)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('amount_paid', models.DecimalField(decimal_places=2, max_digits=10)),
                ('customer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='backend.customer')),
                ('service', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='backend.service')),
            ],
        ),
    ]
