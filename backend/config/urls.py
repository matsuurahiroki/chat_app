from venv import logger
from django.contrib import admin # type: ignore
from django.urls import path # type: ignore
from django.http import HttpResponse # type: ignore
import logging

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', lambda request: HttpResponse("✅ Django is working!")),
]
def test_view(request): # type: ignore
    logger.info("✅ アクセスされました！")
    return HttpResponse("✅ Django is working!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', test_view),  # ← ここでログ出力
]