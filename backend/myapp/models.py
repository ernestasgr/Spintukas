from django.db import models
from django.contrib.auth.models import User

def furniture_defect_image_upload(instance, filename):
    return f'furniture_defects/{instance.user.username}/{filename}'

class FurnitureDefect(models.Model):
    defect_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=[
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ])
    is_resolved = models.BooleanField(default=False)
    resolution_details = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=furniture_defect_image_upload, null=True, blank=True)

    def __str__(self):
        return f"Furniture Defect by {self.user.username} at {self.created_at}"