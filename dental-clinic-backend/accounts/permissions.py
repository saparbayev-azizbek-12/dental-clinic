from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    """
    Custom permission to allow users to see only their own profile,
    or administrators to see any profile.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can see any profile
        if request.user.is_staff:
            return True
        
        # Regular users can see only their own profile
        return obj.id == request.user.id

class IsPatient(permissions.BasePermission):
    """Allow access only to patient users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'patient'

class IsDoctor(permissions.BasePermission):
    """Allow access only to doctor users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'doctor'

class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'admin' 