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

  if (error) return <div className="surface-card p-6 text-[15px] error-text">{error}</div>;
  if (!profile) return <div className="surface-card p-6 text-[15px] text-[var(--olive-gray)]">Loading profile...</div>;

  return (
    <section className="mx-auto max-w-2xl">
      <div className="surface-card p-6">
        <h1 className="section-title">Profile</h1>
        <div className="mt-5 grid gap-4 rounded-[14px] border border-[var(--border-warm)] bg-[var(--white)] p-4">
          <div>
            <p className="eyebrow">Name</p>
            <p className="mt-1 text-[16px] font-medium text-[var(--near-black)]">{profile.name}</p>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <p className="mt-1 text-[16px] font-medium text-[var(--near-black)]">{profile.email}</p>
          </div>
          <div>
            <p className="eyebrow">User ID</p>
            <p className="mt-1 break-all text-[14px] text-[var(--olive-gray)]">{profile.userId}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
