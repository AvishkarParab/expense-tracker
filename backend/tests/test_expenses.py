from fastapi.testclient import TestClient
from datetime import date, timedelta

def test_create_expense(client: TestClient, auth_headers: dict[str, str]):
    payload = {
        "title": "Hosting Plan",
        "amount": 15.00,
        "category": "Infrastructure",
        "notes": "Dev server",
        "expense_date": "2026-09-01",
    }
    response = client.post("/api/v1/expenses/", headers=auth_headers, json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Hosting Plan"
    assert float(data["amount"]) == 15.00
    assert data["expense_date"] == "2026-09-01"
    assert "id" in data
    assert "user_id" in data


def test_create_expense_defaults_expense_date_to_today(
    client: TestClient, auth_headers: dict[str, str]
):
    response = client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "Coffee", "amount": 4.50, "category": "Food"},
    )
    assert response.status_code == 201
    assert response.json()["expense_date"] is not None


def test_expense_insights(client: TestClient, auth_headers: dict[str, str]):
    client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "Coffee", "amount": 4.50, "category": "Food"},
    )
    client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "Bus Pass", "amount": 20.00, "category": "Transport"},
    )

    response = client.get("/api/v1/expenses/insights", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert float(data["total_amount"]) == 24.50
    assert data["total_count"] == 2
    assert len(data["category_breakdown"]) == 2


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

def test_expense_insights_empty_state(client: TestClient, auth_headers: dict[str, str]):
    """Ensure the endpoint safely handles a user with no expenses."""
    response = client.get("/api/v1/expenses/insights", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["total_count"] == 0
    assert float(data["total_amount"]) == 0.0
    assert float(data["average_expense"]) == 0.0
    assert data["month_over_month_change"] == 0.0
    assert data["category_breakdown"] == []


def test_expense_insights_category_math(client: TestClient, auth_headers: dict[str, str]):
    """Verify totals, averages, and category percentage distributions."""
    # Insert 3 expenses: Total = $100 (Food: $80, Transport: $20)
    expenses = [
        {"title": "Groceries", "amount": 50.00, "category": "Food"},
        {"title": "Dinner", "amount": 30.00, "category": "Food"},
        {"title": "Bus", "amount": 20.00, "category": "Transport"},
    ]
    
    for exp in expenses:
        client.post("/api/v1/expenses/", headers=auth_headers, json=exp)

    response = client.get("/api/v1/expenses/insights", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert data["total_count"] == 3
    assert float(data["total_amount"]) == 100.00
    assert float(data["average_expense"]) == 33.33  # 100 / 3 (rounded depending on Pydantic config, but safe as float match)
    
    # Check category grouping and percentages
    categories = {cat["category"]: cat for cat in data["category_breakdown"]}
    assert len(categories) == 2
    
    assert float(categories["Food"]["amount"]) == 80.00
    assert categories["Food"]["count"] == 2
    assert float(categories["Food"]["percentage"]) == 80.0  # 80 out of 100
    
    assert float(categories["Transport"]["amount"]) == 20.00
    assert float(categories["Transport"]["percentage"]) == 20.0


def test_expense_insights_month_over_month(client: TestClient, auth_headers: dict[str, str]):
    """Test the time-based filtering for current vs previous month logic."""
    today = date.today()
    last_month = (today.replace(day=1) - timedelta(days=1))
    
    # Add $100 to Previous Month
    client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "Old Bill", "amount": 100.00, "category": "Bills", "expense_date": last_month.isoformat()},
    )
    
    # Add $150 to Current Month
    client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "New Bill", "amount": 150.00, "category": "Bills", "expense_date": today.isoformat()},
    )

    response = client.get("/api/v1/expenses/insights", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert float(data["total_amount"]) == 250.00
    assert float(data["previous_month_amount"]) == 100.00
    assert float(data["current_month_amount"]) == 150.00
    
    # MoM Change: (150 - 100) / 100 * 100 = 50%
    assert float(data["month_over_month_change"]) == 50.0

def test_expense_insights_mom_infinite_growth(client: TestClient, auth_headers: dict[str, str]):
    """Test when current month has expenses but previous month has 0 (should return 100%)."""
    client.post(
        "/api/v1/expenses/",
        headers=auth_headers,
        json={"title": "First Bill", "amount": 150.00, "category": "Bills", "expense_date": date.today().isoformat()},
    )

    response = client.get("/api/v1/expenses/insights", headers=auth_headers)
    assert response.status_code == 200
    
    # Because previous month is 0, the endpoint is designed to return 100.0
    assert float(response.json()["month_over_month_change"]) == 100.0