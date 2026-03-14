# CoreInventory

A modular **Inventory Management System (IMS)** built with **Node.js, Express, MongoDB, and Mongoose** that digitizes stock operations inside a warehouse environment.

The system replaces manual inventory tracking (Excel sheets, registers) with a **centralized, real-time inventory backend** capable of managing products, warehouse locations, stock movements, and analytics.

This project was built following **ERP-style inventory architecture** where stock history is preserved as a ledger.

---

# Problem Statement

Many small and medium businesses still manage inventory using:

* spreadsheets
* manual registers
* disconnected tools

This causes several issues:

* **No real-time stock visibility**
* **Stock mismatches**
* **Difficult auditing of inventory changes**
* **No structured warehouse tracking**
* **Manual reconciliation of stock**

The goal of this project is to build a **centralized backend inventory system** that provides:

* product management
* warehouse location tracking
* inventory movement operations
* stock adjustments
* low stock alerts
* operational dashboards

---

# System Architecture

The system uses a **ledger-based inventory model**, similar to modern ERP systems such as **Odoo, SAP, and Oracle Inventory**.

Two core entities power the system:

### StockMove (Ledger)

Represents **inventory transactions**.

Examples:

* receipt
* delivery
* transfer
* adjustment

Every inventory change is recorded as a StockMove.

---

### StockQuant (Snapshot)

Represents the **current stock state** of a product at a specific location.

```
StockMove → transaction history
StockQuant → current stock snapshot
```

This architecture allows:

* full inventory audit trails
* accurate stock reconstruction
* scalable inventory queries

---

# Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Architecture

* REST API
* Modular route structure
* Service layer for inventory logic
* MongoDB aggregation pipelines for analytics

---

# Core Features

## Product Management

Create and manage products with structured metadata.

Each product includes:

* name
* SKU
* category
* unit of measure
* reorder level
* stock visibility

Endpoints:

```
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
GET    /api/v1/products/:id/stock
GET    /api/v1/products/:id/moves
```

---

## Category Management

Products are grouped into categories for filtering and reporting.

Endpoints:

```
POST   /api/v1/categories
GET    /api/v1/categories
GET    /api/v1/categories/:id
PATCH  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

Deletion protection prevents removing categories that still contain products.

---

## Warehouse Location System

Supports hierarchical warehouse structures.

Examples:

```
Main Warehouse
 ├ Rack A
 ├ Rack B
Production Floor
```

Each location can represent:

* warehouse
* rack
* vendor
* customer
* virtual loss location

Endpoints:

```
POST   /api/v1/locations
GET    /api/v1/locations
GET    /api/v1/locations/:id
PATCH  /api/v1/locations/:id
DELETE /api/v1/locations/:id
GET    /api/v1/locations/tree
GET    /api/v1/locations/:id/stock
```

---

## Stock Movement Engine

Inventory operations are executed through **StockMove transactions**.

Supported operations:

### Receipt

Incoming goods from vendors.

```
Vendor → Warehouse
```

### Delivery

Outgoing goods to customers.

```
Warehouse → Customer
```

### Transfer

Internal stock movement.

```
Rack A → Rack B
Warehouse → Production
```

### Adjustment

Corrects mismatches between:

* recorded stock
* physical stock

Endpoints:

```
POST   /api/v1/stockMoves
GET    /api/v1/stockMoves
GET    /api/v1/stockMoves/:id
PATCH  /api/v1/stockMoves/:id
POST   /api/v1/stockMoves/:id/validate
```

Stock only changes when a move is **validated**.

---

## Inventory Adjustment

Allows manual correction of stock mismatches discovered during inventory counting.

Endpoint:

```
POST /api/v1/adjustments
```

Process:

```
physical count → system stock difference → adjustment StockMove
```

---

## Product Stock Ledger

Every inventory movement affecting a product can be traced.

Endpoint:

```
GET /api/v1/products/:id/moves
```

Example:

```
+100 receipt
-20 delivery
+10 transfer
-3 adjustment
```

This enables **full inventory auditing**.

---

## Low Stock Alerts

Detects products below reorder threshold.

Endpoint:

```
GET /api/v1/alerts/low-stock
```

Logic:

```
totalStock <= reorderLevel
```

Used for inventory monitoring and dashboard alerts.

---

## Dashboard Analytics

Provides operational insights for inventory managers.

Endpoint:

```
GET /api/v1/dashboard
```

Metrics include:

* total products
* total stock
* low stock items
* pending receipts
* pending deliveries
* internal transfers
* recent inventory activity
* stock distribution by location
* top moving products

---

# Inventory Flow Example

### Step 1: Receive goods

```
Receive 100 units of steel
Vendor → Warehouse
Stock: +100
```

### Step 2: Internal transfer

```
Warehouse → Rack A
Stock redistributed across locations
```

### Step 3: Delivery

```
Warehouse → Customer
Stock: -20
```

### Step 4: Adjustment

```
3 units damaged
Stock: -3
```

All operations are logged in the **StockMove ledger**.

---

# API Versioning

All endpoints are versioned:

```
/api/v1/*
```

Example:

```
GET /api/v1/products
POST /api/v1/stockMoves
GET /api/v1/dashboard
```

---

# Project Structure

```
backend
│
├── controllers
│
├── models
│
├── routes
│
├── services
│
├── utils
│
├── db
│
├── app.js
└── index.js
```

This modular structure improves:

* maintainability
* scalability
* testing capability

---

# Key Design Decisions

### Ledger-Based Inventory

Instead of modifying stock directly, inventory changes are recorded as transactions.

Advantages:

* complete audit trail
* easier debugging
* historical reconstruction
* enterprise-grade architecture

---

### Location Hierarchy

Warehouse structures are modeled as trees using `parentLocation`.

This enables:

* rack level inventory
* multi-warehouse support
* production flow tracking

---

### Aggregation-Based Analytics

MongoDB aggregation pipelines power dashboard metrics such as:

* stock distribution
* top moving products
* low stock detection

---

# Running the Project

### Install dependencies

```
npm install
```

### Run the server

```
npm run dev
```

Server runs on:

```
http://localhost:process.env.PORT
```

---

# Future Improvements

Possible extensions include:

* authentication middleware
* role-based access control
* order reservation system
* inventory forecasting
* WebSocket real-time updates
* barcode scanning integration
---
