from django.db import models

# Create your models here.

#Product
class Slide(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)
    slug = models.SlugField()

    #order by title
    class Meta:
        ordering = ('title',)

    def __str__(self):
        return self.title

    #get absoulute url path
    def get_absolute_url(self):
        return f'/{self.slug}/'

    def get_slide_image(self):
        if self.image:
            return 'http://127.0.0.1:8000' + self.image.url
        return ''