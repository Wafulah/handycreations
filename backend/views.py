from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_protect
from django.utils import timezone
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
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Profile

from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def design(request):
    return render(request, 'index.html')


def web_design(request):
    return render(request, 'index.html')


def interior_design(request):
    return render(request, 'index.html')


def admin_user_view(request):
    # Fetch the admin user from the database
    try:
        admin_user = User.objects.get(email='handycreations@gmail.com')
        admin_profile = Profile.objects.get(user=admin_user)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Admin user not found'}, status=404)
    except Profile.DoesNotExist:
        return JsonResponse({'error': 'Admin profile not found'}, status=404)

    # Prepare the user data to be sent as a JSON response
    user = {
        'id': admin_user.id,
        'avatar': admin_profile.avatar.url if admin_profile.avatar else '',
        'name': admin_profile.name,
        'email': admin_user.email,
        'isAdmin': True
    }

    return JsonResponse(user)


class AdminLoginViewSet(ViewSet):
    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Authentication succeeded
            admin_profile = Profile.objects.get(user=user)
            print(admin_profile)

            response_data = {
                'id': user.id,
                'avatar': admin_profile.avatar.url if admin_profile.avatar else '',
                'name': admin_profile.name,
                'email': user.email,
                'isAdmin': admin_profile.isAdmin
            }
            return Response(response_data)
        else:
            # Authentication failed
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
# class UserViewSet(ViewSet):
#     permission_classes = [IsAuthenticated]

#     def list(self, request):
#         user = request.user
#         return Response({
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             # Add other user fields as needed
#         })
# class AuthenticationViewSet(ViewSet):
#     permission_classes = [IsAuthenticated]

#     def check_authentication(self, request):
#         user = request.user
#         return Response({
#             'isAuthenticated': True,
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 # Add other user fields as needed
#             }
#         })

# class LogoutViewSet(ViewSet):
#     def logout(self, request):
#         # Perform logout operations here
#         # e.g., clearing authentication tokens, session, etc.
#         return Response({'message': 'Logout successful'})

# class LoginViewSet(ViewSet):
#     def create(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # Perform authentication
#         user = authenticate(request, email=email, password=password)

#         if user is not None:
#             # Authentication successful
#             # Return the user details or a token, depending on your implementation
#             return Response({'id': user.id, 'email': user.email, 'username': user.username}, status=status.HTTP_200_OK)
#         else:
#             # Authentication failed
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


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
    queryset = InteriorDesign.objects.order_by('-date')
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
class SearchViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=['post'])
    def search_by_order_number(self, request):
        order_number = request.data.get('order_number')
        if not order_number:
            return Response({"error": "Please provide an order number."}, status=400)

        orders = Order.objects.filter(order_number__icontains=order_number)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=['post'])
    def payment_orders(self, request):
        payment_status = request.data.get('payment_status')
        if not payment_status:
            return Response({"error": "Please provide a payment status."}, status=status.HTTP_400_BAD_REQUEST)

        orders = Order.objects.filter(payment_status=payment_status)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

#view to filter functions
class StatusViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    @action(detail=False, methods=['post'])
    def delivery_status(self, request):
        delivery_status = request.data.get('status')
        if not delivery_status:
            return Response({"error": "Please provide a delivery status."}, status=status.HTTP_400_BAD_REQUEST)

        orders = Order.objects.filter(status=delivery_status)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderUpdateViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=['post'])
    def update_order(self, request):
        order_number = request.data.get('order_number')
        if not order_number:
            return Response({"error": "Please provide an order number."}, status=400)

        order = get_object_or_404(Order, order_number=order_number)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=['post'])
    def update_order(self, request):
        order_number = request.data.get('order_number')
        if not order_number:
            return Response({"error": "Please provide an order number."}, status=400)

        order = get_object_or_404(Order, order_number=order_number)

        # Update the five fields based on the request data
        
        order.status = request.data.get('status', order.status)
        order.payment_status = request.data.get('payment_status', order.payment_status)
        order.amount_paid = int(float(request.data.get('amount_paid', order.amount_paid)))
        order.cost = int(float(request.data.get('cost', order.cost)))
        order.price = int(float(request.data.get('price', order.price)))

        
        order.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data)


class AggregatedDataViewSet(viewsets.ModelViewSet):
    queryset = AggregatedData.objects.all()
    serializer_class = AggregatedDataSerializer


class LatestProductsViewSet(viewsets.ViewSet):
    def list(self, request):
        home_products = Home.objects.order_by('-date')[:5]
        interior_design_products = InteriorDesign.objects.order_by('-date')[:5]
        design_products = Design.objects.order_by('-date')[:5]

        combined_products = list(
            home_products) + list(interior_design_products) + list(design_products)
        sorted_products = sorted(
            combined_products, key=lambda x: x.date, reverse=True)[:5]

        serializer = DesignSerializer(
            sorted_products, many=True, context={'request': request})
        return Response(serializer.data)


class ProductsViewSet(viewsets.ViewSet):
    def list(self, request):
        home_products = Home.objects.order_by('-date')
        interior_design_products = InteriorDesign.objects.order_by('-date')
        design_products = Design.objects.order_by('-date')

        combined_products = list(
            home_products) + list(interior_design_products) + list(design_products)
        sorted_products = sorted(
            combined_products, key=lambda x: x.date, reverse=True)

        serializer = DesignSerializer(
            sorted_products, many=True, context={'request': request})
        return Response(serializer.data)
