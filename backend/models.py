from django.db import models
from django.core.exceptions import ValidationError
from datetime import date
from django.db.models import Sum, Case, When, DecimalField, Value
from django.db.models import Subquery, OuterRef, F
# Create your models here.


class HomeTag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Home(models.Model):
    id = models.AutoField(primary_key=True)
    pic = models.ImageField(upload_to='home_pics')
    name = models.CharField(max_length=100)
    tag = models.ManyToManyField(HomeTag)
    date = models.DateField()
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class InteriorDesignTag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class InteriorDesign(models.Model):
    id = models.AutoField(primary_key=True)
    pic = models.ImageField(upload_to='home_pics')
    name = models.CharField(max_length=100)
    tag = models.ManyToManyField(InteriorDesignTag)
    date = models.DateField()
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Design(models.Model):
    pic = models.ImageField(upload_to='design_pics')
    name = models.CharField(max_length=100)
    date = models.DateField()
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    location = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    signed_up = models.DateField()

    def __str__(self):
        return self.name


class Service(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('DELIVERED', 'Delivered'),
        ('REFUNDED', 'Refunded'),
    ]

    PAYMENT_CHOICES = [
        ('PAID_FULL', 'Paid in Full'),
        ('PAID_PARTIAL', 'Paid Partially'),
        ('NOT_PAID', 'Not Paid'),
    ]

    order_number = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, models.SET_NULL, null=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)
    date = models.DateField(default=date.today)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    profit = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, editable=False)

    def save(self, *args, **kwargs):
        # Calculate profit before saving the object
        if self.cost and self.amount_paid:
            self.profit = self.amount_paid - self.cost
        else:
            self.profit = None

        super().save(*args, **kwargs)

        # Update aggregated data after saving the object
        self.update_aggregated_data()

    def __str__(self):
        return str(self.order_number)

    def update_aggregated_data(self):
        total_customers = Customer.objects.count()
        total_orders = Order.objects.count()
        total_budget = Order.objects.aggregate(
            total_budget=Sum('cost'))['total_budget']

        # Calculate total_profit only for orders where profit is not None
        total_profit = Order.objects.exclude(profit=None).aggregate(
            total_profit=Sum('profit'))['total_profit']

        # Calculate total_profit only for orders where profit is not None
        total_profit = Order.objects.exclude(profit=None).aggregate(total_profit=Sum('profit'))['total_profit']

        Service.objects.update(amount=0, percentage=0)    
        # Calculate the profit and percentage for each service
        if total_profit != 0:
            for service in Service.objects.all():
                service_profit = Order.objects.filter(service=service, profit__isnull=False).aggregate(service_profit=Sum('profit'))['service_profit']
                if service_profit is not None:
                    service.amount += service_profit
                else:
                    service_profit = 0
                service.percentage = (service.amount / total_profit) * 100
                service.save()

        delivered_orders = Order.objects.filter(status='DELIVERED').count()
        percentage_delivered = (delivered_orders / total_orders) * 100

        # Update the aggregated data model or table with the new values
        aggregated_data, _ = AggregatedData.objects.get_or_create(pk=1)
        aggregated_data.total_customers = total_customers
        aggregated_data.total_orders = total_orders
        aggregated_data.total_budget = total_budget
        aggregated_data.total_profit = total_profit
        aggregated_data.percentage_delivered = percentage_delivered
        aggregated_data.save()


class AggregatedData(models.Model):
    total_customers = models.IntegerField(default=0)
    total_orders = models.IntegerField(default=0)
    total_budget = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    total_profit = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, blank=True, null=True)
    percentage_delivered = models.DecimalField(
        max_digits=5, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        total_profit = self.total_profit or 1  # Avoid division by zero

        super().save(*args, **kwargs)
