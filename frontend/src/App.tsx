import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-blue-700 text-white p-4 shadow">
          <h1 className="text-xl font-semibold text-center">
            🧑‍🏫 Coach Desk Admin Panel
          </h1>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>

        <footer className="text-center py-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} Coach Desk | Built with ❤️ by Praveen
        </footer>
      </div>
    </Router>
  );
};

export default App;
