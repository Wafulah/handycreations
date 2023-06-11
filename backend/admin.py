from django.contrib import admin
from .models import Home, HomeTag, InteriorDesign, InteriorDesignTag, Design, Customer, Service, Order, AggregatedData


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'location', 'phone', 'signed_up')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'service', 'date', 'status',
                    'payment_status', 'cost', 'profit', 'price', 'amount_paid')
    list_filter = ('status', 'payment_status', 'service')
    search_fields = ('order_number', 'customer__name', 'service__name')


@admin.register(AggregatedData)
class AggregatedDataAdmin(admin.ModelAdmin):
    list_display = ('total_customers', 'total_orders',
                    'total_budget', 'total_profit', 'percentage_delivered')
    

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HomeTag)
class HomeTagsAdmin(admin.ModelAdmin):
    pass


class HomeAdmin(admin.ModelAdmin):
    filter_horizontal = ('tag',)


admin.site.register(Home, HomeAdmin)


@admin.register(InteriorDesignTag)
class InteriorDesignTagsAdmin(admin.ModelAdmin):
    pass


class InteriorDesignAdmin(admin.ModelAdmin):
    filter_horizontal = ('tag',)


admin.site.register(InteriorDesign, InteriorDesignAdmin)


@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display = ('name', 'pic')
    search_fields = ('name',)
