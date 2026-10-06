from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskApiTests(APITestCase):
    def test_list_empty(self):
        res = self.client.get("/tasks/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json(), [])

    def test_create_valid(self):
        res = self.client.post(
            "/tasks/",
            {"title": "Buy milk", "description": "2 liters"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.json()["title"], "Buy milk")
        self.assertFalse(res.json()["completed"])
        self.assertEqual(Task.objects.count(), 1)

    def test_create_blank_title_rejected(self):
        res = self.client.post("/tasks/", {"title": "", "description": "x"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)

    def test_create_whitespace_title_rejected(self):
        res = self.client.post("/tasks/", {"title": "   ", "description": "x"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)

    def test_retrieve_existing(self):
        task = Task.objects.create(title="Hello", description="World")
        res = self.client.get(f"/tasks/{task.id}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()["title"], "Hello")

    def test_retrieve_missing_404(self):
        res = self.client.get("/tasks/999/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_update(self):
        task = Task.objects.create(title="Old", description="Old desc")
        res = self.client.put(
            f"/tasks/{task.id}/",
            {"title": "New", "description": "New desc"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.title, "New")
        self.assertEqual(task.description, "New desc")

    def test_patch_completed_true_and_false(self):
        task = Task.objects.create(title="T")
        res = self.client.patch(f"/tasks/{task.id}/", {"completed": True}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertTrue(task.completed)
        res = self.client.patch(f"/tasks/{task.id}/", {"completed": False}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertFalse(task.completed)

    def test_patch_rejects_unsupported_fields(self):
        task = Task.objects.create(title="T")
        res = self.client.patch(f"/tasks/{task.id}/", {"title": "Hack"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        task.refresh_from_db()
        self.assertEqual(task.title, "T")

    def test_delete(self):
        task = Task.objects.create(title="Gone")
        res = self.client.delete(f"/tasks/{task.id}/")
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)
