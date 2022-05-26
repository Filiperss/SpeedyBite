from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            name=validated_data['name'],
            username=validated_data['username'],
            password=make_password(validated_data['password'], 'ES2022')
        )
        user.save()
        return user
        # password = validated_data.pop('password', None)
        # instance = self.Meta.model(**validated_data)
        # if password is not None:
        #     print(make_password(password=password,salt='ES2022'))
        #     print(make_password(password=password,salt='ES2022'))
        #     instance.save(is_active=False, is_confirmed=False,
        #                           password=make_password(password=password, salt='ES2022'))
        #     # instance.save()
        #     return instance
