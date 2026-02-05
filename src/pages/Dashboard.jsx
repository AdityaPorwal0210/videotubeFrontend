import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setError("");
        setLoading(true);
        const res = await axiosClient.get("/dashboard/me");
        setStats(res.data?.data || null);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load dashboard stats."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-slate-100">
        Loading dashboard...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-red-300">
        {error || "No stats available."}
      </div>
    );
  }

  const {
    totalVideos,
    totalViews,
    totalLikesOnVideos,
    subscriberCount,
    totalLikesGiven,
    totalCommentsOnVideos,
    latestVideos = [],
  } = stats;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-lg font-semibold text-slate-50">
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Total videos</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalVideos}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Total views</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalViews}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Total likes on videos</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalLikesOnVideos}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Subscribers</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {subscriberCount}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Likes you gave</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalLikesGiven}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs text-slate-400">Comments on your videos</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {totalCommentsOnVideos}
          </p>
        </div>
      </div>

      {/* Latest videos */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-50">
          Latest videos
        </h2>

        {latestVideos.length === 0 ? (
          <p className="text-xs text-slate-300">
            You have not uploaded any videos yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {latestVideos.map((v) => (
              <li
                key={v._id}
                className="flex items-center justify-between rounded-lg bg-slate-900 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-24 overflow-hidden rounded-md bg-black">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-50 line-clamp-2">
                      {v.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {v.views ?? 0} views • {v.likes ?? 0} likes
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  {v.createdAt
                    ? new Date(v.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
