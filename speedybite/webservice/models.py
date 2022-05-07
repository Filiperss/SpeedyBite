from django.db import models

# Create your models here.

class MenuItem(models.Model):
    MenuItem_Id= models.IntegerField()
    name= models.CharField(max_length=250)

    def __str__(self):
	    return self.name

