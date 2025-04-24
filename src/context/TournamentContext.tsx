import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Match, Team, TeamStats, Tournament } from "@/types/cricketTypes";
import { mockTournament } from "@/data/mockTournament";
import {
  supabase,
  isSupabaseAvailable,
  supabaseError,
  initializeDatabase,
} from "@/lib/supabase";
import { calculateNRR } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TournamentContextType {
  tournament: Tournament;
  updateMatch: (match: Match) => Promise<void>;
  getTeamById: (teamId: string) => Team | undefined;
  getTeamStats: (teamId: string) => TeamStats | undefined;
  getUpcomingMatches: (count?: number) => Match[];
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  loading: boolean;
  firebaseStatus: {
    connected: boolean;
    error: string | null;
  };
}

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [tournament, setTournament] = useState<Tournament>(mockTournament);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useLocalData, setUseLocalData] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState({
    connected: false,
    error: supabaseError ? supabaseError.message : null,
  });
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const loadLocalData = () => {
      console.log("Using mock tournament data");
      setTournament(mockTournament);
      setUseLocalData(true);
      setLoading(false);
      setFirebaseStatus((prev) => ({
        ...prev,
        connected: false,
      }));

      toast({
        variant: "destructive",
        title: "Supabase Error",
        description: "Failed to connect to Supabase. Using local data instead.",
      });
    };

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Supabase connection timeout, using local data");
        loadLocalData();
      }
    }, 5000); // Reduced timeout to 5 seconds for faster fallback

    const initializeSupabase = async () => {
      try {
        if (!isSupabaseAvailable()) {
          console.error("Supabase not available, using mock data");
          loadLocalData();
          return;
        }

        try {
          // Initialize database if needed
          await initializeDatabase();

          // Function to fetch tournament data
          const fetchTournamentData = async () => {
            const { data, error } = await supabase
              .from("tournaments")
              .select("*")
              .eq("id", "champions2025")
              .single();

            clearTimeout(timeoutId);

            if (error) {
              console.error("Error fetching tournament data:", error);
              setFirebaseStatus({
                connected: false,
                error: error.message,
              });
              loadLocalData();
              return;
            }

            if (data) {
              setTournament(data as Tournament);
              setFirebaseStatus({
                connected: true,
                error: null,
              });
              setLoading(false);
            } else {
              loadLocalData();
            }
          };

          // Initial fetch
          await fetchTournamentData();

          // Set up subscription for real-time updates
          const tournamentSubscription = supabase
            .channel("tournament-changes")
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "tournaments",
                filter: "id=eq.champions2025",
              },
              (payload) => {
                console.log("Tournament updated:", payload);
                setTournament(payload.new as Tournament);
              }
            )
            .subscribe();

          // Set unsubscribe function
          unsubscribe = () => {
            tournamentSubscription.unsubscribe();
          };
        } catch (error: any) {
          console.error("Error initializing tournament data:", error);
          setFirebaseStatus({
            connected: false,
            error: error.message,
          });
          loadLocalData();
        }
      } catch (error: any) {
        console.error("Error in Supabase initialization:", error);
        setFirebaseStatus({
          connected: false,
          error: error.message,
        });
        loadLocalData();
      }
    };

    initializeSupabase();

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast]);

  const calculateTeamNRR = (teamId: string, matches: Match[]): number => {
    const teamMatches = matches.filter(
      (match) =>
        (match.team1 === teamId || match.team2 === teamId) &&
        match.status === "completed" &&
        match.result
    );

    if (teamMatches.length === 0) return 0;

    let totalRunsScored = 0;
    let totalOversFaced = 0;
    let totalRunsConceded = 0;
    let totalOversBowled = 0;
    let isAllOut = false;

    teamMatches.forEach((match) => {
      if (!match.result) return;

      const isTeam1 = match.team1 === teamId;
      const isWinner = match.result.winner === teamId;
      const isTie = match.result.winner === "Tie";

      if (isTie) {
        // For ties, both teams get their own scores
        const runs = parseInt(
          (isTeam1
            ? match.result.winningTeamScore
            : match.result.losingTeamScore
          ).split("/")[0]
        );
        const overs = isTeam1
          ? match.result.winningTeamOversFaced
          : match.result.losingTeamOversFaced;

        totalRunsScored += runs;
        totalOversFaced += overs;
        totalRunsConceded += runs;
        totalOversBowled += overs;
      } else if (isWinner) {
        // For winners
        const runsScored = parseInt(match.result.winningTeamScore.split("/")[0]);
        const runsConceded = parseInt(match.result.losingTeamScore.split("/")[0]);
        const oversFaced = match.result.winningTeamOversFaced;
        const oversBowled = match.result.losingTeamOversFaced;
        const isOpponentAllOut = match.result.losingTeamScore.includes("/6"); // Check if opponent was all out

        totalRunsScored += runsScored;
        totalOversFaced += oversFaced;
        totalRunsConceded += runsConceded;
        totalOversBowled += oversBowled;
        isAllOut = isOpponentAllOut;
      } else {
        // For losers
        const runsScored = parseInt(match.result.losingTeamScore.split("/")[0]);
        const runsConceded = parseInt(match.result.winningTeamScore.split("/")[0]);
        const oversFaced = match.result.losingTeamOversFaced;
        const oversBowled = match.result.winningTeamOversFaced;
        const isTeamAllOut = match.result.losingTeamScore.includes("/6"); // Check if team was all out

        totalRunsScored += runsScored;
        totalOversFaced += oversFaced;
        totalRunsConceded += runsConceded;
        totalOversBowled += oversBowled;
        isAllOut = isTeamAllOut;
      }
    });

    if (totalOversFaced === 0 || totalOversBowled === 0) return 0;

    return calculateNRR(
      totalRunsScored,
      totalOversFaced,
      totalRunsConceded,
      totalOversBowled,
      isAllOut,
      6 // Maximum overs in the tournament
    );
  };

  const updateMatch = async (updatedMatch: Match) => {
    console.log("==== Update match: ====", updatedMatch);
    console.log("==== Update Tournemtn state: ====", tournament);
    try {
      // Update only the selected match
      const updatedMatches = tournament.matches.map((match) =>
        match.match_id === updatedMatch.match_id
          ? { ...match, ...updatedMatch }
          : match
      );
  
      let updatedStandings = [...tournament.standings];
      let updatedTeams = [...tournament.teams]; // Create a copy of the teams array
  
      if (updatedMatch.status === "completed" && updatedMatch.result) {
        const { winner, loser } = updatedMatch.result;
        const isTie = updatedMatch.result.winner === "Tie";
  
        const updateStats = (
          teamId: string,
          isWinner: boolean,
          isTie: boolean
        ) => {
          const teamStats = updatedStandings.find(
            (stat) => stat.team_id === teamId
          );
  
          if (!teamStats) return;
  
          teamStats.played += 1;
  
          if (isTie) {
            teamStats.points += 1;
          } else if (isWinner) {
            teamStats.won += 1;
            teamStats.points += 2;
          } else {
            teamStats.lost += 1;
          }
        };
  
        if (isTie) {
          // For a tie, update stats for both teams with isTie = true
          updateStats(updatedMatch.team1, false, true);
          updateStats(updatedMatch.team2, false, true);
        } else {
          // For a win/loss, update stats for the winner and loser
          updateStats(winner, true, false);
          updateStats(loser, false, false);
        }
  
        // Recalculate NRR for all teams and update both standings and teams
        updatedStandings = updatedStandings.map((stats) => {
          const nrr = calculateTeamNRR(stats.team_id, updatedMatches);
          // Update the NRR in the teams array as well
          updatedTeams = updatedTeams.map((team) =>
            team.id === stats.team_id ? { ...team, nrr } : team
          );
          return { ...stats, nrr };
        });
  
        // Sort standings
        updatedStandings.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return b.nrr - a.nrr;
        });
      }
  
      console.log("Updated matches:", updatedMatches);
      console.log("Updated standings:", updatedStandings);
      console.log("Updated teams:", updatedTeams); // Log the updated teams
  
      if (useLocalData || !isSupabaseAvailable()) {
        setTournament({
          ...tournament,
          matches: updatedMatches,
          standings: updatedStandings,
          teams: updatedTeams, // Update the teams in the local state
        });
  
        toast({
          title: "Match Updated (Local)",
          description: "Changes saved locally (Supabase not available)",
        });
  
        return;
      }
  
      // Supabase update: update the tournament data
      // const response = await supabase
      //   .from("tournaments")
      //   .update({
      //     matches: updatedMatches,
      //     standings: updatedStandings,
      //     teams: updatedTeams, // Include the updated teams in the Supabase update
      //   })
      //   .eq("id", tournament.id)
      //   .select();
  
      // console.log("Supabase response:", response);
  
      // if (response?.error) throw response.error;
  
      setTournament({
        ...tournament,
        matches: updatedMatches,
        standings: updatedStandings,
        teams:
          // response.data ? response.data[0]?.teams :
          updatedTeams, // Use data from Supabase if available
      });
  
      toast({
        title: "Match Updated",
        description: "Match result and standings updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating match:", error);
      setFirebaseStatus({
        connected: false,
        error: error.message,
      });
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update match. Changes not saved.",
      });
    }
  };

  const getTeamById = (teamId: string): Team | undefined => {
    console.log("Fetching team by ID:", teamId, tournament);
    return tournament.teams.find((team) => team.id === teamId);
  };

  const getTeamStats = (teamId: string): TeamStats | undefined => {
    return tournament.standings.find((stats) => stats.team_id === teamId);
  };

  const getUpcomingMatches = (count?: number): Match[] => {
    const upcoming = tournament.matches
      .filter((match) => match.status === "scheduled")
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

    return count ? upcoming.slice(0, count) : upcoming;
  };

  const contextValue: TournamentContextType = {
    tournament,
    updateMatch,
    getTeamById,
    getTeamStats,
    getUpcomingMatches,
    isAdmin,
    setIsAdmin,
    loading,
    firebaseStatus,
  };

  return (
    <TournamentContext.Provider value={contextValue}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = (): TournamentContextType => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};
