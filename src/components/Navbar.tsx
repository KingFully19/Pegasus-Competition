import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WingMark from "./WingMark";

const linkBase =
  "px-3 py-2 text-sm font-semibold tracking-wide transition-colors border-b-2";
const linkActive = "text-(--color-gold-bright) border-(--color-gold)";
const linkIdle =
  "text-(--color-bone-dim) border-transparent hover:text-(--color-bone) hover:border-(--color-silver-dim)";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-(--color-panel-border) bg-(--color-ink)/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <WingMark size={32} />
          <span className="font-[var(--font-display)] text-lg text-(--color-bone)">
            אליפות פגאסוס
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            לוח מובילים
          </NavLink>
          <NavLink
            to="/missions"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            משימות
          </NavLink>
          {user && profile && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              הפרופיל שלי
            </NavLink>
          )}
          {profile?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              ניהול
            </NavLink>
          )}
        </nav>

        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-(--color-panel-border) px-4 py-1.5 text-sm text-(--color-bone-dim) hover:border-(--color-gold) hover:text-(--color-gold-bright) transition-colors"
            >
              התנתקות
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-(--color-gold) px-4 py-1.5 text-sm font-semibold text-(--color-ink) hover:bg-(--color-gold-bright) transition-colors"
            >
              התחברות
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
