# Job Applications Tracker API

This is a simple RESTful API built with **Express.js** and **MongoDB** to manage job applications. It allows creating, viewing, filtering, updating, and deleting job application records.

## 🚀 Features

- Add a new job application
- Retrieve all applications
- Filter by:
  - Status (`applied`, `interview`, `offer`, `rejected`)
  - Application date range
- View a specific application
- Update application status
- Delete an application

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- CORS
- dotenv for environment configuration

---

## 📘 API Endpoints

### ✅ Get all job applications

Fetches all job applications from the database.

```http
GET /applications
```

### 🔍 Filter by status

Fetches all job applications that match a specific status.

```http
GET /applications/status/:status
```

### 📅 Filter by applied date range

Fetches job applications where the `appliedDate` falls between the provided `start` and `end` dates (inclusive).

```http
GET /applications/range?start=YYYY-MM-DD&end=YYYY-MM-DD
```

### 🔎 Get a specific application

Fetches a single job application by its unique ID.

```http
GET /applications/:id
```

### ➕ Add a new job application

Creates and stores a new job application in the database.

```http
POST /applications
```

### ✏️ Update application status

Updates the status of an existing job application by its ID.

```http
PATCH /applications/status
```

### ❌ Delete an application

Deletes a job application by its ID.

```http
DELETE /applications/:id
```

