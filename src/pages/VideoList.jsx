import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVideos() {
      try {
        setError("");
        setLoading(true);
        const res = await axiosClient.get("/videos");
        setVideos(res.data?.data?.videos || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load videos. Try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 items-center justify-center px-4 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-xl border border-red-500 bg-red-600/20 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-slate-50">
        Recommended videos
      </h1>

      {videos.length === 0 ? (
        <p className="text-sm text-slate-300">No videos uploaded yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
              className="group cursor-pointer overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700 hover:ring-violet-400 transition shadow-md"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail?.url || video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-slate-50">
                  {video.duration || "10:24"}
                </span>
              </div>

              <div className="flex gap-3 p-3">
                <div className="mt-1 h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-700" />
                <div className="flex-1">
                  <h2 className="line-clamp-2 text-sm font-semibold text-slate-50 group-hover:text-violet-300 transition">
                    {video.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {video.owner?.username || "Channel name"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {video.views || 0} views •{" "}
                    {video.createdAt
                      ? new Date(video.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoList;
