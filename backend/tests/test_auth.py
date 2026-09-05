from fastapi.testclient import TestClient
from app.models.user import User


def test_register_user_success(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "newuser@example.com", "password": "StrongPassword1!"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_register_duplicate_email(client: TestClient, test_user: User):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": test_user.email, "password": "Password123!"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client: TestClient, test_user: User):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": test_user.email, "password": "Password123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_user_profile(client: TestClient, auth_headers: dict[str, str]):
    response = client.get("/api/v1/users/profile", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@example.com"


def test_update_user_profile(client: TestClient, auth_headers: dict[str, str]):
    response = client.patch(
        "/api/v1/users/profile",
        headers=auth_headers,
        json={"full_name": "Updated Name", "currency": "EUR"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"
    assert data["currency"] == "EUR"