import os
from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:PSGRdb0723%3B@localhost:5432/warehouse")
PORT = int(os.getenv("FLASK_PORT", "5001"))

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def fetchall_dict(sql, params=None):
    with get_conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params or [])
            return cur.fetchall()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/sensor-alert")
def sensor_alert():
    rows = fetchall_dict("""
        SELECT product_id, stock, alert
        FROM inventory_alerts
        ORDER BY product_id
    """)
    return jsonify({"sensor_alerts": rows})

@app.get("/rfid-scan")
def rfid_scan():
    rows = fetchall_dict("""
        SELECT product_id, location, timestamp
        FROM rfid_logs
        ORDER BY timestamp DESC
        LIMIT 200
    """)
    return jsonify({"rfid_scans": rows})

@app.get("/sales")
def sales():
    rows = fetchall_dict("""
        SELECT month, SUM(sales) AS sales
        FROM sales
        GROUP BY month
        ORDER BY month
    """)
    return jsonify({"sales": rows})

@app.get("/predict-demand")
def predict_demand():
    # Simple baseline: predicted = rolling avg of last 2 months (per month index)
    actual = fetchall_dict("""
        SELECT month, SUM(sales) AS sales
        FROM sales
        GROUP BY month
        ORDER BY month
    """)
    # Build naive predictions
    month_to_sales = {r["month"]: int(r["sales"]) for r in actual}
    predicted = []
    for m in range(1, 13):
        if m - 1 in month_to_sales and m - 2 in month_to_sales:
            pred = (month_to_sales[m - 1] + month_to_sales[m - 2]) // 2
        elif m - 1 in month_to_sales:
            pred = month_to_sales[m - 1]
        else:
            pred = month_to_sales.get(m, 0)
        predicted.append({"month": m, "predicted": int(pred)})
    return jsonify({"actual": actual, "predicted": predicted})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
