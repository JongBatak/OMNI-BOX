<div align="center">
  
  # 🪐 Omnispace 

  <p>A modern, full-stack web application featuring an immersive Next.js UI with 3D Spline animations and a robust Laravel 11 REST API backend.</p>

  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ✨ Features

- **🛡️ Secure Access:** Role-Based Access Control (RBAC) securely separating Customer and Admin features.
- **🔑 Stateless Auth:** Token-based authentication using **Laravel Sanctum**.
- **🎨 Immersive UI:** Highly interactive frontend featuring 3D Spline scenes, liquid text reveals, layered scrolling, and polished React animations.
- **⚡ Decoupled Architecture:** Clean separation of concerns with a standalone Next.js frontend and independent Laravel API backend.

## 🛠️ Tech Stack

### Frontend (`/Frontend`)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, Spline (3D)

### Backend (`/Backend`)
- **Framework:** Laravel 11
- **Language:** PHP 8.x
- **Database:** MySQL / SQLite
- **Authentication:** Laravel Sanctum

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- PHP (v8.2+)
- Composer
- A Database (MySQL, SQLite, etc.)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/projekakhir.git
cd projekakhir
```

### 2. Backend Setup (Laravel API)

```bash
cd Backend

# Install PHP dependencies
composer install

# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the Laravel development server
php artisan serve
```
*The API will be available at `http://localhost:8000`*

### 3. Frontend Setup (Next.js)

Open a new terminal window:

```bash
cd Frontend

# Install Node.js dependencies
npm install

# Copy the environment file (if applicable)
cp .env.example .env.local

# Start the Next.js development server
npm run dev
```
*The frontend will be available at `http://localhost:3000`*

---

## 📂 Project Structure

```text
projekakhir/
├── Backend/               # Laravel 11 API Backend
│   ├── app/Models/        # Eloquent Data Models
│   ├── app/Http/
│   │   └── Controllers/   # API logic (Auth, Dashboard)
│   ├── routes/            # REST API routing (api.php)
│   └── database/          # Migrations and Seeders
│
└── Frontend/              # Next.js SPA
    ├── src/app/           # Next.js App Router Pages 
    ├── src/components/    # Reusable UI & Animations (Spline, Hero, etc.)
    └── public/            # Static assets
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

---

<div align="center">
  Built with sweat and blood for the Final Project.
</div>
