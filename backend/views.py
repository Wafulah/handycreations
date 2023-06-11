from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import HomeTag, Home, InteriorDesignTag, InteriorDesign, Design,  Customer, Service, Order, AggregatedData
from .serializers import (
    HomeTagSerializer,
    HomeSerializer,
    InteriorDesignTagSerializer,
    InteriorDesignSerializer,
    DesignSerializer,
    CustomerSerializer,
    ServiceSerializer,
    OrderSerializer,
    AggregatedDataSerializer

)


class HomeTagViewSet(viewsets.ModelViewSet):
    queryset = HomeTag.objects.all()
    serializer_class = HomeTagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class HomeViewSet(viewsets.ModelViewSet):
    queryset = Home.objects.all()
    serializer_class = HomeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class InteriorDesignTagViewSet(viewsets.ModelViewSet):
    queryset = InteriorDesignTag.objects.all()
    serializer_class = InteriorDesignTagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class InteriorDesignViewSet(viewsets.ModelViewSet):
    queryset = InteriorDesign.objects.all()
    serializer_class = InteriorDesignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class DesignViewSet(viewsets.ModelViewSet):
    queryset = Design.objects.all()
    serializer_class = DesignSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class AggregatedDataViewSet(viewsets.ModelViewSet):
    queryset = AggregatedData.objects.all()
    serializer_class = AggregatedDataSerializer


class LatestProductsViewSet(viewsets.ViewSet):
    def list(self, request):
        home_products = Home.objects.order_by('-date')[:5]
        interior_design_products = InteriorDesign.objects.order_by('-date')[:5]
        design_products = Design.objects.order_by('-date')[:5]

        combined_products = list(home_products) + list(interior_design_products) + list(design_products)
        sorted_products = sorted(combined_products, key=lambda x: x.date, reverse=True)[:5]

        serializer = DesignSerializer(sorted_products, many=True, context={'request': request})
        return Response(serializer.data)


class ProductsViewSet(viewsets.ViewSet):
    def list(self, request):
        home_products = Home.objects.order_by('-date')
        interior_design_products = InteriorDesign.objects.order_by('-date')
        design_products = Design.objects.order_by('-date')

        combined_products = list(home_products) + list(interior_design_products) + list(design_products)
        sorted_products = sorted(combined_products, key=lambda x: x.date, reverse=True)

        serializer = DesignSerializer(sorted_products, many=True, context={'request': request})
        return Response(serializer.data)
