from rest_framework.permissions import BasePermission


class RequiredPlanPermission(BasePermission):
    def has_permission(self, request, view):
        required_plan = getattr(view, 'required_plan', 0)
        return request.user.effective_plan >= required_plan
