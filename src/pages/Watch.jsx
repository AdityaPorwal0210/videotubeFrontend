import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Comments from "./Comments.jsx";

function Watch() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0); // NEW

 useEffect(() => {
  async function fetchVideo() {
    try {
      setError("");
      setLoading(true);

      const res = await axiosClient.get(`/videos/${videoId}`);
      const data = res.data?.data || null;
      setVideo(data);

      // init likes from backend
      setLikesCount(data?.likes || 0);
      setLiked(!!data?.isLikedByCurrentUser);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load video. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (videoId) fetchVideo();
}, [videoId]);


  const handleToggleLike = async () => {
    if (!videoId || likeLoading) return;

    try {
      setLikeLoading(true);

      const res = await axiosClient.post(`/likes/toggle/v/${videoId}`);
      const payload = res.data?.data;

      if (typeof payload?.likes === "number") {
        setLikesCount(payload.likes);
      }
      if (typeof payload?.liked === "boolean") {
        setLiked(payload.liked);
      }
    } catch (err) {
      console.error(err);
      // optional: show toast
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-1 items-center justify-center px-4 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-xl border border-red-500 bg-red-600/20 px-4 py-3 text-sm text-red-100">
          {error || "Video not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Video player */}
      <div className="overflow-hidden rounded-xl bg-black shadow-xl ring-1 ring-slate-800">
        {video.videoFile ? (
          <video
            src={video.videoFile}
            controls
            className="w-full max-h-[520px] bg-black"
          />
        ) : (
          <img
            src={video.thumbnail?.url || video.thumbnail}
            alt={video.title}
            className="w-full max-h-[520px] object-contain bg-black"
          />
        )}
      </div>

      {/* Title and meta */}
      <h1 className="mt-4 text-lg font-semibold tracking-tight text-slate-50">
        {video.title}
      </h1>
      <p className="mt-2 text-sm text-slate-200">{video.description}</p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-700" />
          <div>
            <p className="text-sm font-semibold text-slate-50">
              {video.owner?.fullName || video.owner?.username || "Channel"}
            </p>
            <p className="text-xs text-slate-300">
              {video.views || 0} views •{" "}
              {video.createdAt
                ? new Date(video.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className={
              "rounded-full px-4 py-1.5 text-xs font-semibold transition shadow-sm " +
              (liked
                ? "bg-violet-500 text-white hover:bg-violet-400"
                : "bg-slate-800 text-slate-50 hover:bg-slate-700")
            }
          >
            {likeLoading ? "…" : liked ? "Liked" : "Like"}
          </button>

          {/* likes count display */}
          <span className="text-xs text-slate-300">
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </span>

          <button className="rounded-full bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-50 hover:bg-slate-700 transition">
            Subscribe
          </button>
        </div>
      </div>

      {/* Comments */}
      <Comments videoId={videoId} />
    </div>
  );
}

export default Watch;
