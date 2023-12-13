from django.urls import path
from . import views

urlpatterns = [
    path("register", views.register, name="register"),
    path("login", views.user_login, name="login"),
    path("furniture_defects", views.furniture_defects, name="furniture_defects"),
    path("furniture_defects_user", views.furniture_defects_user, name="furniture_defects_user"),
    path("register_defect", views.register_defect, name="register_defect"),
    path("update_defect", views.update_defect, name="update_defect")
]

