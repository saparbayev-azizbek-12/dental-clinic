"""
ASGI config for clinic project with WebSocket support.
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import appointments.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            appointments.routing.websocket_urlpatterns
        )
    ),
}) 