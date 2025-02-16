import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Home } from "@/pages/Home";
import { CreatePoll } from "@/pages/CreatePoll";
import { PollDetails } from "@/pages/PollDetails";
import { Header } from "@/components/Header";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 w-full px-4 py-8">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<PollDetails />} />
            </Routes>
          </div>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
