from django.urls import path
from .views import (
    RegisterUserView,
    UserLoginView,
    FurnitureDefectsView,
    RegisterDefectView,
    UpdateDefectView,
    FurnitureDefectsUserView
)

urlpatterns = [
    path('register', RegisterUserView.as_view(), name='register'),
    path('login', UserLoginView.as_view(), name='login'),
    path('furniture_defects', FurnitureDefectsView.as_view(), name='defects'),
    path('register_defect', RegisterDefectView.as_view(), name='register_defect'),
    path('update_defect', UpdateDefectView.as_view(), name='update_defect'),
    path('furniture_defects_user', FurnitureDefectsUserView.as_view(), name='user_defects'),
]

