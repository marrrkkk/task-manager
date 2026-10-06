from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ViewSet):
    def list(self, request):
        tasks = Task.objects.order_by("-created_at")
        return Response(TaskSerializer(tasks, many=True).data)

    def create(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        task = get_object_or_404(Task, pk=pk)
        return Response(TaskSerializer(task).data)

    def update(self, request, pk=None):
        task = get_object_or_404(Task, pk=pk)
        if set(request.data.keys()) - {"title", "description"}:
            return Response(
                {"detail": "PUT accepts only title and description. Use PATCH for completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = TaskSerializer(task, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        task = get_object_or_404(Task, pk=pk)
        allowed = {"completed"}
        if set(request.data.keys()) != allowed:
            return Response(
                {"detail": "PATCH accepts only {'completed': true/false}."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = TaskSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        task = get_object_or_404(Task, pk=pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
