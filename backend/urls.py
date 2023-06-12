from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from . import views

# Create a router and register your viewsets
router = routers.DefaultRouter()
router.register('home-tags', views.HomeTagViewSet)
router.register('homes', views.HomeViewSet)
router.register('interior-design-tags', views.InteriorDesignTagViewSet)
router.register('interior-designs', views.InteriorDesignViewSet)
router.register('designs', views.DesignViewSet)
router.register('customers', views.CustomerViewSet)
router.register('services', views.ServiceViewSet)
router.register('orders', views.OrderViewSet)
router.register('aggregated-data', views.AggregatedDataViewSet)
router.register('latest-products', views.LatestProductsViewSet,
                basename='latest-products')
router.register('products', views.ProductsViewSet, basename='products')
router.register('login', views.AdminLoginViewSet, basename='admin_login')


# router.register('login', views.LoginViewSet, basename='login')
# router.register('authentication', views.AuthenticationViewSet, basename='authentication')
# router.register('logout', views.LogoutViewSet, basename='logout')
# router.register('user', views.UserViewSet, basename='user')

urlpatterns = [
    # Your app's URL patterns here
    # ...
    path('admin/user/', views.admin_user_view, name='admin_user_view'),

    # path('api/check_authentication/', views.AuthenticationViewSet.as_view({'get': 'check_authentication'}), name='check_authentication'),
    # path('api/logout/', views.LogoutViewSet.as_view({'post': 'logout'}), name='logout'),

    path('api/', include(router.urls)),
]

# Include the following lines to serve media and static files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
