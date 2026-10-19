"""Authentication endpoints: register, login, logout, me."""
import sqlite3

from flask import Blueprint, g, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from database import get_db
from security import error_response, get_csrf_token, start_user_session, user_to_dict
from validators import clean_text, validate_registration

bp = Blueprint("auth", __name__, url_prefix="/api")

# Used so a login attempt for an unknown email takes the same time as a real one.
_DUMMY_HASH = generate_password_hash("not-a-real-password-123")


@bp.get("/csrf-token")
def csrf_token():
    return jsonify({"csrf_token": get_csrf_token()})


@bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    cleaned, errors = validate_registration(data)
    if errors:
        return error_response("Please fix the highlighted fields.", 400, errors)

    db = get_db()
    if db.execute("SELECT 1 FROM users WHERE email = ?", (cleaned["email"],)).fetchone():
        return error_response(
            "An account with this email already exists.",
            409,
            {"email": "An account with this email already exists."},
        )

    try:
        cursor = db.execute(
            "INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
            (
                cleaned["full_name"],
                cleaned["email"],
                cleaned["phone"],
                generate_password_hash(cleaned["password"]),
                cleaned["role"],
            ),
        )
        db.commit()
    except sqlite3.IntegrityError:
        return error_response("An account with this email already exists.", 409)

    token = start_user_session(cursor.lastrowid)
    user = db.execute(
        "SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?",
        (cursor.lastrowid,),
    ).fetchone()
    return jsonify({"user": user_to_dict(user), "csrf_token": token}), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = clean_text(data.get("email")).lower()
    password = data.get("password") if isinstance(data.get("password"), str) else ""

    if not email or not password:
        return error_response("Please enter your email and password.", 400)

    row = get_db().execute(
        "SELECT id, full_name, email, phone, role, created_at, password_hash FROM users WHERE email = ?",
        (email,),
    ).fetchone()

    password_ok = check_password_hash(row["password_hash"] if row else _DUMMY_HASH, password)
    if row is None or not password_ok:
        return error_response("Invalid email or password.", 401)

    token = start_user_session(row["id"])
    return jsonify({"user": user_to_dict(row), "csrf_token": token})


@bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out.", "csrf_token": get_csrf_token()})


@bp.get("/me")
def me():
    return jsonify({"user": user_to_dict(g.user), "csrf_token": get_csrf_token()})
