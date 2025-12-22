import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { SignedIn, SignedOut, SignInButton, UserButton,SignIn, SignUp } from '@clerk/clerk-react';
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-blue-400 text-white p-4 shadow flex items-center justify-center gap-3">
  
  <div className="flex items-center">
  <h1 className="text-xl font-semibold">
    Coach Management – Admin Panel
  </h1>

  <div className="pl-140 scale-125 text-white">
    <UserButton
      showName
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
          userButtonOuterIdentifier: "text-indigo-600",
      userButtonPopoverActionButtonText: "text-gray-700",
      userButtonPopoverSignOutButtonText: "text-red-600"
        }
      }}
    />
  </div>
</div>


</header>

        <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center mb-6">
        <SignedOut>
        <SignIn />
      </SignedOut>
      </div>
      <SignedIn>
        <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        
        <Routes>
            <Route path="/login" element={<SignIn />} />
          </Routes>
        <Routes>
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        
      </SignedIn>
          
        </main>

        <footer className="text-center py-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} Coach Desk | Developed by Praveen
        </footer>
      </div>
    </Router>
  );
};

export default App;
