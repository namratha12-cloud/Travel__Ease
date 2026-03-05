# 🚌 TravelEase - Bus Booking System

## 📋 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technologies & Languages](#technologies--languages)
- [Database Model](#database-model)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Suggested Workflow](#suggested-workflow)
- [Setup Instructions](#setup-instructions)
- [Features](#features)

---

## 📖 Overview

**TravelEase** is a full-stack web application for bus ticket booking and management. The system allows users to:
- Search for available buses by route and date
- Book tickets with passenger and agency details
- View booking history by passenger ID

The application follows a **client-server architecture** with a RESTful API backend and a responsive frontend.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  index.html  │  │ search.html  │  │  book.html   │      │
│  │   (Home)     │  │ (Search Bus) │  │ (Book Ticket)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│  ┌──────────────┐          │                  │              │
│  │  view.html   │          │                  │              │
│  │(View Booking)│          │                  │              │
│  └──────────────┘          │                  │              │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                      style.css                               │
└─────────────────────────────┬───────────────────────────────┘
                              │
                    HTTP Requests (Fetch API)
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    BACKEND (Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              server.js (Express)                     │   │
│  │  ┌────────────────┐  ┌────────────────┐             │   │
│  │  │ GET /search-bus│  │  POST /book    │             │   │
│  │  └────────────────┘  └────────────────┘             │   │
│  │  ┌────────────────────────────────────┐             │   │
│  │  │   GET /view-booking/:pid           │             │   │
│  │  └────────────────────────────────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                     MySQL Connection                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   DATABASE (MySQL)                           │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│  │   bus    │   │  agency  │   │ booking  │                │
│  └──────────┘   └──────────┘   └──────────┘                │
│       Travels1 Database                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technologies & Languages

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14.x+ | Runtime environment |
| **Express.js** | ^4.22.1 | Web framework for REST API |
| **MySQL2** | ^3.16.0 | MySQL database driver |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |

**Language**: JavaScript (ES6+)

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure and semantic markup |
| **CSS3** | Styling with glassmorphism effects |
| **JavaScript (Vanilla)** | Client-side logic and Fetch API |

### **Database**
| Technology | Purpose |
|------------|---------|
| **MySQL** | Relational database management |

### **Development Tools**
- **Nodemon** (^3.0.3) - Auto-restart server during development

---

## 🗄️ Database Model

### **Entity-Relationship Diagram**

```
┌─────────────────┐
│     AGENCY      │
├─────────────────┤
│ a_id (PK)       │
│ a_name          │
└────────┬────────┘
         │
         │ 1
         │
         │ N
         │
┌────────▼────────┐        ┌─────────────────┐
│    BOOKING      │        │      BUS        │
├─────────────────┤        ├─────────────────┤
│ book_id (PK)    │   N    │ b_id (PK)       │
│ p_id            │◄───────┤ b_scr           │
│ a_id (FK)       │   1    │ b_dest          │
│ b_id (FK)       │        │ b_date          │
│ b_date          │        │ b_time          │
│ b_time          │        └─────────────────┘
└─────────────────┘
```

### **Database Schema**

#### **1. `bus` Table**
Stores bus route information.

| Column | Type | Description |
|--------|------|-------------|
| `b_id` | INT (PK) | Unique bus identifier (201-312) |
| `b_scr` | VARCHAR(255) | Source city |
| `b_dest` | VARCHAR(255) | Destination city |
| `b_date` | VARCHAR(255) | Travel date (YYYY-MM-DD) |
| `b_time` | VARCHAR(255) | Departure time (HH:MM) |

#### **2. `agency` Table**
Stores travel agency information.

| Column | Type | Description |
|--------|------|-------------|
| `a_id` | INT (PK) | Unique agency identifier (101-103) |
| `a_name` | VARCHAR(255) | Agency name |

#### **3. `booking` Table**
Stores passenger booking records.

| Column | Type | Description |
|--------|------|-------------|
| `book_id` | INT (PK, AUTO_INCREMENT) | Unique booking ID |
| `p_id` | INT | Passenger ID |
| `a_id` | INT (FK) | Agency ID (references `agency.a_id`) |
| `b_id` | INT (FK) | Bus ID (references `bus.b_id`) |
| `b_date` | VARCHAR(255) | Booking date |
| `b_time` | VARCHAR(255) | Booking time |

### **SQL Schema Creation**

```sql
CREATE DATABASE Travels1;
USE Travels1;

-- Bus table
CREATE TABLE bus (
    b_id INT PRIMARY KEY,
    b_scr VARCHAR(255) NOT NULL,
    b_dest VARCHAR(255) NOT NULL,
    b_date VARCHAR(255) NOT NULL,
    b_time VARCHAR(255) NOT NULL
);

-- Agency table
CREATE TABLE agency (
    a_id INT PRIMARY KEY,
    a_name VARCHAR(255) NOT NULL
);

-- Booking table
CREATE TABLE booking (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    p_id INT NOT NULL,
    a_id INT NOT NULL,
    b_id INT NOT NULL,
    b_date VARCHAR(255) NOT NULL,
    b_time VARCHAR(255) NOT NULL,
    FOREIGN KEY (b_id) REFERENCES bus(b_id),
    FOREIGN KEY (a_id) REFERENCES agency(a_id)
);

-- Sample data for agencies
INSERT INTO agency (a_id, a_name) VALUES 
(101, 'Express Travels'),
(102, 'City Transport'),
(103, 'Metro Bus Services');

-- Sample data for buses
INSERT INTO bus (b_id, b_scr, b_dest, b_date, b_time) VALUES 
(201, 'New York', 'Boston', '2024-03-15', '06:00'),
(202, 'Los Angeles', 'San Francisco', '2024-03-15', '09:00'),
(203, 'Chicago', 'Detroit', '2024-03-15', '12:00');
```

---

## 📁 Project Structure

```
TravelEase/
│
├── backend/
│   ├── db/
│   │   └── db.js                 # Database connection helper (unused)
│   ├── routes/                   # Empty (routes defined in server.js)
│   ├── node_modules/             # Dependencies
│   ├── package.json              # Backend dependencies
│   ├── package-lock.json
│   └── server.js                 # Main Express server
│
├── frontend/
│   ├── index.html                # Home page (navigation)
│   ├── search.html               # Search buses by route/date
│   ├── book.html                 # Book ticket form
│   ├── view.html                 # View passenger bookings
│   └── style.css                 # Global styles
│
└── README.md                     # This file
```

---

## 🔌 API Endpoints

### **1. Search Buses**
**Endpoint**: `GET /search-bus`

**Description**: Search for buses by source, destination, and date.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | String | Yes | Source city |
| `to` | String | Yes | Destination city |
| `date` | String | Yes | Travel date (YYYY-MM-DD) |

**Example Request**:
```
GET http://localhost:7000/search-bus?from=New York&to=Boston&date=2024-03-15
```

**Response** (200 OK):
```json
[
  {
    "busId": 201,
    "source": "New York",
    "destination": "Boston",
    "departure": "06:00"
  }
]
```

---

### **2. Book Ticket**
**Endpoint**: `POST /book`

**Description**: Book a ticket for a passenger.

**Request Body**:
```json
{
  "p_id": 1001,
  "a_id": 101,
  "b_id": 201,
  "date": "2024-03-15",
  "time": "06:00"
}
```

**Response** (200 OK):
```json
{
  "message": "✅ Booking successful"
}
```

**Response** (400 Bad Request - Bus not available):
```json
{
  "error": "❌ Bus not available for selected date & time",
  "suggestions": [
    { "b_id": 202, "b_time": "09:00" },
    { "b_id": 203, "b_time": "12:00" }
  ]
}
```

---

### **3. View Booking**
**Endpoint**: `GET /view-booking/:pid`

**Description**: Retrieve all bookings for a passenger.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `pid` | Integer | Passenger ID |

**Example Request**:
```
GET http://localhost:7000/view-booking/1001
```

**Response** (200 OK):
```json
[
  {
    "busId": 201,
    "source": "New York",
    "destination": "Boston",
    "travelDate": "2024-03-15",
    "departure": "06:00:00",
    "agencyName": "Express Travels"
  }
]
```

---

## 🔄 Suggested Workflow

### **For End Users**

```
1. Open index.html (Home Page)
   │
   ├─► Search Bus (search.html)
   │   ├─ Enter: Source, Destination, Date
   │   ├─ Click "Search Bus"
   │   └─ View available buses in table
   │
   ├─► Book Ticket (book.html)
   │   ├─ Enter: Passenger ID, Agency ID, Bus ID, Date, Time
   │   ├─ Click "Confirm Booking"
   │   └─ Receive confirmation or suggestions
   │
   └─► View Booking (view.html)
       ├─ Enter: Passenger ID
       ├─ Click "View Booking"
       └─ See all bookings for that passenger
```

### **For Developers**

#### **Initial Setup**
```bash
# 1. Clone repository
git clone https://github.com/namratha12-cloud/Travel_Ease.git
cd Travel_Ease

# 2. Extract project files
unzip Travelease.zip

# 3. Set up database
mysql -u root -p < schema.sql

# 4. Install backend dependencies
cd backend
npm install

# 5. Configure database credentials
# Edit server.js lines 12-15 with your MySQL credentials

# 6. Start backend server
npm start
# Server runs on http://localhost:7000

# 7. Open frontend
# Open frontend/index.html in browser
```

#### **Development Workflow**
```bash
# Use nodemon for auto-restart during development
npm run dev

# Test API endpoints
curl http://localhost:7000/search-bus?from=NewYork&to=Boston&date=2024-03-15
```

---

## 🛠️ Setup Instructions

### **Prerequisites**
- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** (optional) - [Download](https://git-scm.com/)

### **Step 1: Database Setup**

1. **Start MySQL server**
   ```bash
   # Windows
   net start MySQL

   # macOS/Linux
   sudo systemctl start mysql
   ```

2. **Create database and tables**
   ```bash
   mysql -u root -p
   ```
   
   Then run the SQL schema from the [Database Model](#database-model) section.

3. **Insert sample data** (optional)
   ```sql
   INSERT INTO bus (b_id, b_scr, b_dest, b_date, b_time) VALUES 
   (201, 'New York', 'Boston', '2024-03-15', '06:00'),
   (202, 'Los Angeles', 'San Francisco', '2024-03-15', '09:00');
   ```

### **Step 2: Backend Setup**

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database connection**
   
   Edit `server.js` (lines 11-16):
   ```javascript
   const db = mysql.createConnection({
     host: "localhost",
     user: "root",        // Your MySQL username
     password: "root",    // Your MySQL password
     database: "Travels1"
   });
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   🚀 Server running on port 7000
   ✅ MySQL Connected
   ```

### **Step 3: Frontend Setup**

1. **Open frontend**
   - Navigate to `frontend/` folder
   - Double-click `index.html` to open in browser
   
   **OR** use a local server (recommended):
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8000
   # Open http://localhost:8000
   
   # Using Node.js http-server
   npx http-server frontend -p 8000
   ```

2. **Verify connection**
   - Click "Search Bus"
   - Enter test data and search
   - If results appear, setup is complete!

---

## ✨ Features

### **Current Features**
- ✅ Search buses by route and date
- ✅ Book tickets with validation
- ✅ View passenger booking history
- ✅ Responsive glassmorphism UI
- ✅ Error handling with suggestions
- ✅ RESTful API architecture

### **Potential Enhancements**
- 🔐 User authentication and authorization
- 💳 Payment gateway integration
- 📧 Email confirmation for bookings
- 🎫 QR code ticket generation
- 📊 Admin dashboard for bus/agency management
- 🔍 Advanced search filters (price, bus type)
- ⭐ Rating and review system
- 📱 Mobile app (React Native)

---

## 📝 License

This project is open-source and available for educational purposes.

---

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

