# Smart Warehouse Inventory Analytics Dashboard

This project is a full-stack analytics dashboard designed for smart warehouse inventory management. It visualizes real-time and historical data from various sources, helping users to efficiently monitor inventory levels, analyze demand trends, and track product movements.

## Features

- **Inventory Stock Levels**: A bar chart that provides a clear overview of the current stock for each product.
- **Demand Analysis**: A line graph comparing predicted versus actual demand over a specific period.
- **Recent RFID Scans**: A sortable table that displays the latest product movements and scans.
- **Product Movement Heatmap**: A heatmap that visualizes activity patterns by location and hour, helping to identify high-traffic areas and times.

## Tech Stack

- **Frontend**: Next.js (React) for the UI, with Chart.js for data visualization, and custom components.
- **Backend**: A combination of a **Flask API (Python)** for data aggregation and a **Laravel (PHP)** backend for business logic and data storage.
- **Data Sources**: REST APIs for gathering inventory, sales, predictions, and RFID scan data.
- **Deployment**: **Docker Compose** is used for orchestrating and managing the multiple services.

## Getting Started

1.  **Clone the repository**:

    ```bash
    git clone [https://github.com/your-org/smart-warehouse-inventory-mgt.git](https://github.com/your-org/smart-warehouse-inventory-mgt.git)
    cd smart-warehouse-inventory-mgt
    ```

2.  **Configure environment variables**:
    Edit the `.env` files located in each service directory (`frontend-nextjs`, `flask-api`, `laravel-backend`) to suit your specific configuration needs.

3.  **Start all services**:

    ```bash
    docker-compose up --build
    ```

4.  **Access the dashboard**:
    Open your web browser and navigate to `http://localhost:3000` to view the dashboard.

## Directory Structure

├── flask-api/ # Python API for data aggregation
├── frontend-nextjs/ # Next.js UI for the dashboard
└── laravel-backend/ # Laravel backend for business logic and data storage

## Customization

- To add or modify chart components, you can edit the files within the `components` directory.
- To update API endpoints, make the necessary changes in `dashboard.js`.

## License

This project is open-source and is made available under the **MIT License**.
