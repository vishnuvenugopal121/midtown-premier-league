import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminMatchForm from "@/components/AdminMatchForm";
import { Match } from "@/types/cricket";
import TeamLogo from "@/components/TeamLogo";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCcw, AlertTriangle } from "lucide-react";

const AdminPanel = () => {
  const { tournament, isAdmin, loading } = useTournament();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { toast } = useToast();
  const [loadingError, setLoadingError] = useState(false);

  // Set a timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingError(true);
      }
    }, 8000); // Show error after 8 seconds of loading

    return () => clearTimeout(timer);
  }, [loading]);

  const handleForceReload = () => {
    setLoadingError(false);
    window.location.reload();
  };

  // Group matches by status
  const completedMatches = tournament.matches.filter(
    (match) => match.status === "completed"
  );
  const scheduledMatches = tournament.matches.filter(
    (match) => match.status === "scheduled"
  );

  if (loading && !loadingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cricket-primary" />
          <p className="text-gray-500">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  if (loading && loadingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-gray-600 mb-6">
            We're having some trouble connecting to the Supabase database. The
            app will use local data if the connection isn't restored.
          </p>
          <Button
            onClick={handleForceReload}
            className="mx-auto flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-4">You need admin privileges to access this page.</p>
          <Button asChild>
            <a href="/">Go to Homepage</a>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Admin Panel
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-amber-700 mb-1">
            Admin Mode Active
          </h2>
          <p className="text-xs text-amber-600">
            You can update any match result. All changes will be stored in the
            database.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Matches</h2>

          <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="scheduled">Scheduled Matches</TabsTrigger>
              <TabsTrigger value="completed">Completed Matches</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled">
              {scheduledMatches.length === 0 ? (
                <p className="text-gray-500">No scheduled matches available.</p>
              ) : (
                <div className="space-y-4">
                  {scheduledMatches.map((match) => (
                    <MatchListItem
                      key={match.match_id}
                      match={match}
                      onSelect={setSelectedMatch}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedMatches.length === 0 ? (
                <p className="text-gray-500">No completed matches available.</p>
              ) : (
                <div className="space-y-4">
                  {completedMatches.map((match) => (
                    <MatchListItem
                      key={match.match_id}
                      match={match}
                      onSelect={setSelectedMatch}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {selectedMatch && (
          <Dialog
            open={!!selectedMatch}
            onOpenChange={() => setSelectedMatch(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Match Result</DialogTitle>
              </DialogHeader>
              <AdminMatchForm
                match={selectedMatch}
                onClose={() => setSelectedMatch(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

const MatchListItem = ({
  match,
  onSelect,
}: {
  match: Match;
  onSelect: (match: Match) => void;
}) => {
  const { tournament, getTeamById } = useTournament();

  const teamA = getTeamById(match.team1);
  const teamB = getTeamById(match.team2);
  const isCompleted = match.status === "completed";

  console.log("Match:", match);

  return (
    <div
      key={match.match_id}
      className={`border rounded-lg p-4 ${
        isCompleted ? "bg-gray-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <TeamLogo teamId={match.team1} size="sm" />
            <span className="ml-2 font-medium">{teamA?.id}</span>
          </div>
          <div className="text-gray-500">vs</div>
          <div className="flex items-center">
            <TeamLogo teamId={match.team2} size="sm" />
            <span className="ml-2 font-medium">{teamB?.id}</span>
          </div>
        </div>

        {!isCompleted && (
          <Button
            variant={isCompleted ? "outline" : "default"}
            onClick={() => onSelect(match)}
          >
            {isCompleted ? "Edit Result" : "Update Result"}
          </Button>
        )}
      </div>

      {isCompleted && match.result && (
        <div className="mt-2 text-sm text-gray-600">
          Result: {match.result.winner === match.team1 ? teamA?.id : teamB?.id}{" "}
          won by {match.result.winMargin}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
