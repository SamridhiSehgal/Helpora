// App.js or main routing file
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VictimDashboard from "./components/victim/VictimDashboard";

function App() {
  const victim = { id: "1", name: "John Doe", email: "john@example.com" };

  return (
    <BrowserRouter>
      <Routes>
        {/* Other routes */}
        <Route path="/victim/*" element={<VictimDashboard victim={victim} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;