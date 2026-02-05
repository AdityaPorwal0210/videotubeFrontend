import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

function Comments({ videoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  async function loadComments() {
    try {
      setError("");
      setLoading(true);
      const res = await axiosClient.get(`/comments/${videoId}`);
      setComments(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (videoId) loadComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
  e.preventDefault();
  if (!text.trim()) return;

  try {
    setError("");
    await axiosClient.post(`/comments/${videoId}`, {
      content: text.trim(),
    });

    setText("");
    // re-fetch so we get populated owner, correct order, etc.
    await loadComments();
  } catch (err) {
    console.error(err);
    setError(err?.response?.data?.message || "Failed to add comment.");
  }
};


  const handleDeleteComment = async (commentId) => {
    try {
      setError("");
      await axiosClient.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete comment.");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (commentId) => {
  if (!editingText.trim()) return;
  try {
    setError("");
    const res = await axiosClient.patch(`/comments/${commentId}`, {
      content: editingText.trim(),
    });
    const updated = res.data?.data;

    setComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        // fallback: if updated has no owner, keep old owner
        return {
          ...updated,
          owner: updated.owner || c.owner,
        };
      })
    );
    setEditingId(null);
    setEditingText("");
  } catch (err) {
    console.error(err);
    setError(err?.response?.data?.message || "Failed to update comment.");
  }
};


  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold text-slate-50">
        Comments {comments.length ? `(${comments.length})` : ""}
      </h2>

      {user && (
        <form
          onSubmit={handleAddComment}
          className="mb-4 flex items-start gap-3"
        >
          <div className="mt-1 h-9 w-9 rounded-full bg-amber-400 text-xs font-semibold text-slate-900 flex items-center justify-center">
            {user.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              placeholder="Add a public comment..."
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setText("")}
                className="rounded-full px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="rounded-full bg-violet-500 px-4 py-1 text-xs font-semibold text-white shadow-md hover:bg-violet-400 disabled:opacity-50"
              >
                Comment
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-xs text-slate-300">Loading comments...</p>
      ) : error ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-slate-300">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const isOwner =
              user && c.owner && String(c.owner._id) === String(user._id);
            const isEditing = editingId === c._id;

            return (
              <li key={c._id} className="flex gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-slate-700" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-50">
                      {c.owner?.username || c.owner?.fullName || "User"}
                    </p>
                    {isOwner && !isEditing && (
                      <div className="flex gap-2 text-[11px] text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(c)}
                          className="hover:text-slate-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c._id)}
                          className="hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-1">
                      <textarea
                        rows={2}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none ring-1 ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
                      />
                      <div className="mt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(c._id)}
                          className="rounded-full bg-violet-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-violet-400"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="rounded-full px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-200">{c.content}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Comments;
