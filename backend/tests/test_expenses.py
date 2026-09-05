from fastapi.testclient import TestClient


def test_create_expense(client: TestClient, auth_headers: dict[str, str]):
    payload = {
        "title": "Hosting Plan",
        "amount": 15.00,
        "category": "Infrastructure",
        "notes": "Dev server",
    }
    response = client.post("/api/v1/expenses/", headers=auth_headers, json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Hosting Plan"
    assert float(data["amount"]) == 15.00
    assert "id" in data
    assert "user_id" in data


def test_unauthorized_access_fails(client: TestClient):
    response = client.get("/api/v1/expenses/")
    assert response.status_code == 401


def test_list_user_expenses(client: TestClient, auth_headers: dict[str, str]):
    client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "Coffee", "amount": 4.50, "category": "Food"},
    )
    response = client.get("/api/v1/expenses/", headers=auth_headers)
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 1
    assert any(item["title"] == "Coffee" for item in items)