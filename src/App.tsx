import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext";
import Index from "./pages/Index";
import PointsTablePage from "./pages/PointsTablePage";
import FixturesPage from "./pages/FixturesPage";
import TeamsPage from "./pages/TeamsPage";
import AdminPanel from "./pages/AdminPanel";
import MatchHistory from "./pages/MatchHistory";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  // Create a client inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TournamentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/points-table" element={<PointsTablePage />} />
              <Route path="/fixtures" element={<FixturesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/matches" element={<MatchHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TournamentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
