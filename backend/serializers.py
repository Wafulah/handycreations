from rest_framework import serializers
from .models import HomeTag, Home, InteriorDesignTag, InteriorDesign, Design, Customer, Service, Order, AggregatedData


class HomeTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTag
        fields = '__all__'


class HomeSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = Home
        fields = ['id', 'pic', 'name','tag', 'date','featured']

    # def create(self, validated_data):
        
    #     tag_ids = validated_data.pop('tag')
    #     home = Home.objects.create(**validated_data)

    #     # Retrieve the HomeTag objects based on the tag IDs and add them to the many-to-many field
    #     for tag_id in tag_ids:
    #         tag = HomeTag.objects.get(id=int(tag_id))
    #         home.tag.add(tag)
        
    #     return home


    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop('tag')
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.pic = validated_data.get('pic', instance.pic)
    #     instance.save()
    #     instance.tag.clear()
    #     for tag_data in tags_data:
    #         instance.tag.add(HomeTag.objects.create(**tag_data))
    #     return instance


class InteriorDesignTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteriorDesignTag
        fields = '__all__'


class InteriorDesignSerializer(serializers.ModelSerializer):
    tag = InteriorDesignTagSerializer(many=True)

    class Meta:
        model = InteriorDesign
        fields = ['id', 'pic', 'name', 'tag','date','featured']

    # def create(self, validated_data):
    #     tags_data = validated_data.pop('tag')
    #     interior_design = InteriorDesign.objects.create(**validated_data)
    #     for tag_data in tags_data:
    #         interior_design.tag.add(
    #             InteriorDesignTag.objects.create(**tag_data))
    #     return interior_design

    # def update(self, instance, validated_data):
    #     tags_data = validated_data.pop('tag')
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.pic = validated_data.get('pic', instance.pic)
    #     instance.save()
    #     instance.tag.clear()
    #     for tag_data in tags_data:
    #         instance.tag.add(InteriorDesignTag.objects.create(**tag_data))
    #     return instance


class DesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = ['id', 'pic', 'name', 'date', 'featured']

    def create(self, validated_data):
        return Design.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.pic = validated_data.get('pic', instance.pic)
        instance.name = validated_data.get('name', instance.name)
        instance.date = validated_data.get('date', instance.date)
        instance.featured = validated_data.get('featured', instance.featured)
        instance.save()
        return instance




class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'location', 'phone', 'signed_up']

    def create(self, validated_data):
        return Customer.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        instance.location = validated_data.get('location', instance.location)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.signed_up = validated_data.get('signed_up', instance.signed_up)
        instance.save()
        return instance


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'amount', 'percentage']

    def create(self, validated_data):
        return Service.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.percentage = validated_data.get('percentage', instance.percentage)
        instance.save()
        return instance


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_number', 'customer', 'service', 'date', 'status', 'payment_status', 'amount_paid', 'cost', 'price', 'profit']

    def create(self, validated_data):
        return Order.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.order_number = validated_data.get('order_number', instance.order_number)
        instance.customer = validated_data.get('customer', instance.customer)
        instance.service = validated_data.get('service', instance.service)
        instance.date = validated_data.get('date', instance.date)
        instance.status = validated_data.get('status', instance.status)
        instance.payment_status = validated_data.get('payment_status', instance.payment_status)
        instance.amount_paid = validated_data.get('amount_paid', instance.amount_paid)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.price = validated_data.get('price', instance.price)
        instance.profit = validated_data.get('profit', instance.profit)
        instance.save()
        return instance


class AggregatedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AggregatedData
        fields = ['id', 'total_customers', 'total_orders', 'total_budget', 'total_profit', 'percentage_delivered']

        