// src/pages/Tweets.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

function Tweets() {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    async function loadTweets() {
      if (!user?._id) return;
      try {
        setError("");
        setLoading(true);
        const res = await axiosClient.get(`/tweets/user/${user._id}`);
        setTweets(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Failed to load tweets."
        );
      } finally {
        setLoading(false);
      }
    }
    loadTweets();
  }, [user?._id]);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setError("");
      const res = await axiosClient.post("/tweets", {
        content: text.trim(),
      });
      const newTweet = res.data?.data;
      if (newTweet) {
        setTweets((prev) => [newTweet, ...prev]);
      }
      setText("");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to create tweet."
      );
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      setError("");
      await axiosClient.delete(`/tweets/${tweetId}`);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to delete tweet."
      );
    }
  };

  const handleUpdateTweet = async (tweetId, newContent, onDone) => {
    if (!newContent.trim()) return;
    try {
      setError("");
      const res = await axiosClient.patch(`/tweets/${tweetId}`, {
        content: newContent.trim(),
      });
      const updated = res.data?.data;
      setTweets((prev) =>
        prev.map((t) => (t._id === tweetId ? updated : t))
      );
      onDone();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to update tweet."
      );
    }
  };

  const handleToggleLike = async (
    tweetId,
    liked,
    setLocalLiked,
    setLocalCount
  ) => {
    try {
      await axiosClient.post(`/likes/toggle/t/${tweetId}`);
      const nextLiked = !liked;
      setLocalLiked(nextLiked);
      setLocalCount((c) => c + (nextLiked ? 1 : -1));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-slate-100">
        Loading tweets...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-lg font-semibold text-slate-50">
        My Tweets
      </h1>

      {user && (
        <form
          onSubmit={handleCreateTweet}
          className="mb-6 rounded-xl bg-slate-900 p-4"
        >
          <textarea
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500"
            placeholder="What's happening?"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!text.trim()}
              className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-400 disabled:opacity-50"
            >
              Tweet
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="mb-3 text-xs text-red-300">{error}</p>
      )}

      {tweets.length === 0 ? (
        <p className="text-xs text-slate-300">You have not tweeted yet.</p>
      ) : (
        <ul className="space-y-3">
          {tweets.map((t) => (
            <TweetItem
              key={t._id}
              tweet={t}
              currentUser={user}
              onDelete={handleDeleteTweet}
              onUpdate={handleUpdateTweet}
              onToggleLike={handleToggleLike}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TweetItem({
  tweet,
  currentUser,
  onDelete,
  onUpdate,
  onToggleLike,
}) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content);

  const isOwner =
    currentUser &&
    tweet.owner &&
    String(tweet.owner) === String(currentUser._id);

  const handleSaveEdit = () => {
    onUpdate(tweet._id, editText, () => setEditing(false));
  };

  return (
    <li className="rounded-xl bg-slate-900 p-3">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-slate-700" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-50">
                {isOwner ? "You" : "User"}
              </p>
              <p className="text-[11px] text-slate-500">
                {tweet.createdAt
                  ? new Date(tweet.createdAt).toLocaleString()
                  : ""}
              </p>
            </div>
            {isOwner && !editing && (
              <div className="flex gap-2 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="hover:text-slate-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(tweet._id)}
                  className="hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="mt-2">
              <textarea
                rows={2}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full rounded-lg bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none ring-1 ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500"
              />
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-full bg-violet-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-violet-400"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setEditText(tweet.content);
                  }}
                  className="rounded-full px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-100 whitespace-pre-wrap">
              {tweet.content}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onToggleLike(tweet._id, liked, setLiked, setLikesCount)
              }
              className={
                "rounded-full px-3 py-1 text-[11px] font-semibold " +
                (liked
                  ? "bg-violet-500 text-white"
                  : "bg-slate-800 text-slate-100")
              }
            >
              {liked ? "Liked" : "Like"}
            </button>
            <span className="text-[11px] text-slate-400">
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Tweets;
