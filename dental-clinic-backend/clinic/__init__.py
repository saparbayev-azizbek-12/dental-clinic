# Celery uchun sozlamalar
from __future__ import absolute_import, unicode_literals

# Celeryni o'rnatish
from .celery import app as celery_app

__all__ = ('celery_app',) 