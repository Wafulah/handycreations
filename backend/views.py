from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_protect
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

from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Profile


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
        print(username, password)

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        print(user)

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
