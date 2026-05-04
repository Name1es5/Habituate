import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Exercise from "./pages/Exercise";
import PostExercise from "./pages/PostExercise";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/post-exercise" element={<PostExercise />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
