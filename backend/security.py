"""Authentication, role checks, CSRF protection and error helpers."""
import hmac
import secrets
from functools import wraps

from flask import g, jsonify, request, session

from database import get_db


class ApiError(Exception):
    """Raise this anywhere in a route to send a JSON error to the frontend."""

    def __init__(self, message, status=400, errors=None, code=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.errors = errors
        self.code = code


def error_response(message, status=400, errors=None, code=None):
    body = {"error": message}
    if errors:
        body["errors"] = errors
    if code:
        body["code"] = code
    return jsonify(body), status


# ---------------------------------------------------------------- CSRF ----
def get_csrf_token():
    """Return the CSRF token stored in the session (create one if needed)."""
    token = session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["csrf_token"] = token
    return token


def csrf_protect():
    """Reject state-changing API requests that do not send the CSRF token.

    The frontend reads the token from /api/csrf-token (or /api/me) and sends it
    back in the X-CSRF-Token header. Another website cannot read that token,
    so it cannot forge requests using the user's session cookie.
    """
    if request.method not in ("POST", "PUT", "PATCH", "DELETE"):
        return None
    if not request.path.startswith("/api/"):
        return None
    expected = session.get("csrf_token", "")
    sent = request.headers.get("X-CSRF-Token", "")
    if not expected or not hmac.compare_digest(expected.encode(), sent.encode()):
        return error_response(
            "Your security token is missing or expired. Please refresh the page and try again.",
            403,
            code="csrf_failed",
        )
    return None


# ------------------------------------------------------------- Sessions ---
def load_current_user():
    """Look up the logged-in user (if any) before every request."""
    g.user = None
    user_id = session.get("user_id")
    if user_id is None:
        return
    row = get_db().execute(
        "SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()
    if row is None:
        session.clear()  # user was deleted
    else:
        g.user = row


def start_user_session(user_id):
    """Log a user in. Clearing the old session prevents session fixation."""
    session.clear()
    session.permanent = True
    session["user_id"] = user_id
    return get_csrf_token()


def user_to_dict(row):
    """Only safe fields are sent to the frontend (never the password hash)."""
    if row is None:
        return None
    return {
        "id": row["id"],
        "full_name": row["full_name"],
        "email": row["email"],
        "phone": row["phone"],
        "role": row["role"],
        "created_at": row["created_at"],
    }


# ---------------------------------------------------------- Decorators ----
def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if g.get("user") is None:
            return error_response("Please log in to continue.", 401, code="not_authenticated")
        return view(*args, **kwargs)

    return wrapped


def role_required(role):
    """Allow only users with the given role ('student' or 'owner')."""

    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            user = g.get("user")
            if user is None:
                return error_response("Please log in to continue.", 401, code="not_authenticated")
            if user["role"] != role:
                return error_response(
                    f"Only {role} accounts can do this.", 403, code="forbidden"
                )
            return view(*args, **kwargs)

        return wrapped

    return decorator
