# 💰 Expense Tracker — Full Stack Application
A **production-ready Expense Tracker** built with a clean backend and modern frontend architecture.
This project demonstrates:
- Proper API design  
- Idempotent operations  
- Request validation  
- Export functionality  
- Dockerization  
- Deployment readiness  

<video src="https://github.com/user-attachments/assets/0d09c7ff-579c-49c6-86c5-ebd716f04101" controls width="600"></video>
---

## 🚀 Features

- Add expenses  
- Delete expenses  
- Filter by category  
- Sort by date  
- View filtered total  
- Export as CSV  
- Export as Excel  
- Swagger API documentation  
- Dockerized setup  
- Production deployment ready  

---

## 🏗 Architecture

```
Frontend (React + Vite)
        ↓
Express Backend (MVC)
        ↓
Service Layer (Business Logic)
        ↓
Model Layer
        ↓
Supabase (PostgreSQL)
```


---

## 📂 Backend Structure

```
controllers/
services/
models/
routes/
middlewares/
config/
server.js
app.js
```

### MVC Responsibilities

- **Controllers** → Handle request/response  
- **Services** → Business logic & idempotency  
- **Models** → Database queries  
- **Middlewares** → Validation & error handling  

---

## 🔐 Idempotent API

- `POST` accepts `Idempotency-Key`
- Prevents duplicate submissions
- Safe against retries and double-clicks

---

## 📚 API Documentation

Swagger docs available at:

```
/api-docs
```
<img width="1897" height="870" alt="image" src="https://github.com/user-attachments/assets/5d4eed72-52d0-4820-af91-a95c3f40b397" />

---

## 🐳 Run entire project locally with a single command

From project root:

```bash
docker compose up --build
```

### Local URLs

- **Frontend:** http://localhost:5173  
- **Backend:** http://localhost:5000  
- **Swagger:** http://localhost:5000/api-docs  

---

## 🌍 Deployment

**Setup:**

- Frontend → Vercel  
- Backend → Render  
- Database → Supabase  

---

## 🧩 API Endpoints

```
POST   /api/expenses
GET    /api/expenses
DELETE /api/expenses/:id
GET    /api/expenses/export?format=csv
GET    /api/expenses/export?format=excel
```

---

## 🎯 Highlights

- Clean architecture  
- Proper request validation  
- Centralized error handling  
- Idempotent POST design  
- Dockerized full-stack setup  
- Production-ready configuration  

---

## 🏁 Summary
This is a **full-stack, production-structured Expense Tracker** designed with maintainability, scalability, and real-world backend best practices in mind.
