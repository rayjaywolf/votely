import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Home } from "@/pages/Home";
import { CreatePoll } from "@/pages/CreatePoll";
import { PollDetails } from "@/pages/PollDetails";
import { Header } from "@/components/Header";

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
        <Header />
        <main className="px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePoll />} />
              <Route path="/poll/:id" element={<PollDetails />} />
            </Routes>
          </div>
        </main>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;
