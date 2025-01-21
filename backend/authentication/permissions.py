from rest_framework.permissions import BasePermission


class RequiredPlanPermission(BasePermission):
    def has_permission(self, request, view):
        required_plan = getattr(view, 'required_plan', 1)
        return request.user.plan >= required_plan
