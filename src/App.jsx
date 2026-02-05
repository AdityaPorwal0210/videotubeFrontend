import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import VideoList from "./pages/VideoList.jsx";
import Login from "./pages/Login.jsx";
import Watch from "./pages/Watch.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tweets from "./pages/Tweets.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/watch/:videoId" element={<Watch />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tweets"
            element={
              <ProtectedRoute>
                <Tweets />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
