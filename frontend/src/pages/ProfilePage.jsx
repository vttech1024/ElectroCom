// ─── ProfilePage.jsx ──────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import api from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((response) => setProfile(response.data))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load profile"));
  }, []);

  if (error) return (
    <div className="volt-card p-6 font-mono text-[13px] text-[var(--volt-danger)]">
      <span className="text-[var(--volt-muted)] mr-2">ERR:</span>{error}
    </div>
  );
  if (!profile) return (
    <div className="volt-card p-6 font-mono text-[13px] text-[var(--volt-muted)] flex items-center gap-3">
      <span className="volt-loader" /> Loading profile...
    </div>
  );

  return (
    <section className="volt-section max-w-2xl">
      <div className="volt-page-header">
        <div className="volt-label">ACCOUNT</div>
        <h1 className="volt-page-title">Profile</h1>
      </div>

      <div className="volt-card p-0 overflow-hidden">
        <div className="volt-card-header">
          <div className="volt-avatar">
            {profile.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-[16px] font-bold text-[var(--volt-fg)] tracking-tight">{profile.name}</p>
            <p className="font-mono text-[12px] text-[var(--volt-muted)]">{profile.email}</p>
          </div>
        </div>

        <div className="divide-y divide-[var(--volt-border)]">
          <div className="volt-profile-row">
            <span className="volt-label">NAME</span>
            <span className="volt-profile-val">{profile.name}</span>
          </div>
          <div className="volt-profile-row">
            <span className="volt-label">EMAIL</span>
            <span className="volt-profile-val">{profile.email}</span>
          </div>
          <div className="volt-profile-row">
            <span className="volt-label">USER ID</span>
            <span className="font-mono text-[12px] text-[var(--volt-muted)] break-all">{profile.userId}</span>
          </div>
        </div>
      </div>
    </section>
  );
}