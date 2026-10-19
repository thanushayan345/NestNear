<<<<<<< HEAD
# NestNear — Student Accommodation Website (Sri Lanka)

**NestNear** is a beginner-friendly full-stack web application that helps university students across Sri Lanka find rooms, boarding houses, and annexes near their universities, and allows property owners to publish listings and manage booking requests.

---

## 1. Technology Stack

- **Frontend:** React 18, Vite, JavaScript (JSX), Tailwind CSS, React Router v6, Fetch API
- **Backend:** Python Flask, Flask-CORS, Werkzeug password hashing, session-based authentication + CSRF protection
- **Database:** SQLite (`sqlite3` standard library) with foreign key enforcement (`PRAGMA foreign_keys = ON`) and automatic schema & sample data initialization

---

## 2. Project Structure

```text
nestnear/
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py              # Register, login, logout, current user, CSRF token
│   │   ├── accommodations.py    # Search, view, create, edit, delete, availability
│   │   └── bookings.py          # Student requests, cancel, owner accept/reject
│   ├── sample_images/           # Sample photos copied into uploads/ on first run
│   ├── instance/                # Auto-created SQLite database folder
│   ├── uploads/                 # Local storage for uploaded listing photos
│   ├── app.py                   # Flask app factory & entry point
│   ├── constants.py             # Sri Lankan districts, universities, facilities
│   ├── database.py              # SQLite connection, transaction & schema helpers
│   ├── security.py              # Session auth, role decorators & CSRF protection
│   ├── seed.py                  # Realistic Sri Lankan sample listings & reset CLI
│   ├── validators.py            # Backend input & image magic-byte validation
│   ├── test_api.py              # Automated backend API test suite
│   ├── .env.example             # Example environment variable file
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/
│   │   └── nestnear-logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccommodationCard.jsx
│   │   │   ├── AccommodationForm.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AccommodationSearchPage.jsx
│   │   │   ├── AccommodationDetailsPage.jsx
│   │   │   ├── StudentDashboardPage.jsx
│   │   │   ├── StudentBookingsPage.jsx
│   │   │   ├── OwnerDashboardPage.jsx
│   │   │   ├── AddAccommodationPage.jsx
│   │   │   ├── EditAccommodationPage.jsx
│   │   │   ├── OwnerBookingsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   ├── api.js           # Fetch API wrapper with CSRF & cookie support
│   │   │   └── AuthContext.jsx  # Authentication context provider
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 3. Demo Accounts (Seeded Automatically)

When the backend starts for the first time, it creates the SQLite database at `backend/instance/nestnear.sqlite3` and seeds 12 realistic Sri Lankan university listings (Moratuwa, USJ/Nugegoda, Colombo, Kelaniya, SLIIT/Malabe, Peradeniya, Ruhuna/Matara, Jaffna, Sabaragamuwa/Belihuloya, Rajarata/Mihintale, Uva Wellassa/Badulla):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@nestnear.lk` | `Student123` |
| **Owner 1** | `owner@nestnear.lk` | `Owner1234` |
| **Owner 2** | `owner2@nestnear.lk` | `Owner1234` |

*(You can also click the **Demo Student** or **Demo Owner** quick-fill buttons on the Login page.)*

---

## 4. How to Run in VS Code on Windows

Open the `nestnear` folder in **Visual Studio Code**, then open **two terminals** (`Ctrl + Shift + ~`).

### Terminal 1 — Start the Python Flask Backend

```powershell
cd backend

# 1. Create a virtual environment (first time only)
python -m venv .venv

# 2. Install backend dependencies
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

# 3. Copy .env.example to .env if not already created
Copy-Item .env.example .env

# 4. Start the Flask API server on http://127.0.0.1:5000
.\.venv\Scripts\python.exe app.py
```

### Terminal 2 — Start the React (Vite) Frontend

> **Note for Windows PowerShell:** If PowerShell displays an `Execution_Policies` message when running `npm`, either use `npm.cmd` (shown below) or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once.

```powershell
cd frontend

# 1. Install frontend packages (first time only)
npm.cmd install

# 2. Start the Vite development server on http://localhost:5173
npm.cmd run dev
```

Now open **http://localhost:5173** in your browser.

---

## 5. Useful Commands

- **Run backend automated tests:**
  ```powershell
  cd backend
  .\.venv\Scripts\python.exe -m unittest test_api.py -v
  ```
- **Reset the database back to fresh sample data:**
  ```powershell
  cd backend
  .\.venv\Scripts\python.exe seed.py --reset
  ```
- **Build the frontend for production:**
  ```powershell
  cd frontend
  npm.cmd run build
  ```

---

## 6. REST API Endpoints

### Authentication
- `GET /api/csrf-token` — Issue a CSRF token for state-changing requests
- `POST /api/register` — Register a new `student` or `owner` account
- `POST /api/login` — Authenticate and start a session
- `POST /api/logout` — Clear the current session
- `GET /api/me` — Return the currently logged-in user

### Accommodations
- `GET /api/options` — Return districts, universities, types, and facility options
- `GET /api/accommodations` — Search/filter accommodations (district, town, university, max_rent, type, gender, available_only)
- `GET /api/accommodations/<id>` — View details (exact address & owner phone are hidden unless the viewer is the listing owner or a student with an `Accepted` booking)
- `GET /api/owner/accommodations` — List the logged-in owner's properties
- `POST /api/accommodations` — Create a listing with photo upload (`owner` only)
- `PUT /api/accommodations/<id>` — Edit an owned listing (`owner` only)
- `PATCH /api/accommodations/<id>/availability` — Toggle availability (`owner` only)
- `DELETE /api/accommodations/<id>` — Delete an owned listing (`owner` only)

### Bookings
- `POST /api/bookings` — Submit a booking request with `move_in_date` and `message` (`student` only)
- `GET /api/student/bookings` — List the logged-in student's booking requests (`student` only)
- `PATCH /api/bookings/<id>/cancel` — Cancel a `Pending` booking request (`student` only)
- `GET /api/owner/bookings` — List booking requests for the owner's properties (`owner` only)
- `PATCH /api/bookings/<id>/status` — `Accept` or `Reject` a pending request (`owner` only; checks room availability and prevents overlapping confirmed bookings)
=======
# NestNear
find accounmantion
>>>>>>> 520f141bb215c953ae6914e2899405934089d7f3
