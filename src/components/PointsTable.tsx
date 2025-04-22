
import { useTournament } from '@/context/TournamentContext';
import TeamLogo from './TeamLogo';
import MatchResultIcon from './MatchResultIcon';
import { Loader2, AlertTriangle, RefreshCcw, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const PointsTable = () => {
  const { tournament, getTeamById, loading, firebaseStatus } = useTournament();
  const [loadingError, setLoadingError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  
  // Set a timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadingError(true);
      }
    }, 4000); // Show error after 4 seconds of loading (reduced from 8s)
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Force a component refresh after 7 seconds if still loading
  useEffect(() => {
    if (loading && loadingError) {
      const forceRefreshTimer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        toast({
          title: "Using local data",
          description: "Connection issues detected. Displaying cached data instead.",
        });
      }, 3000); // 7 seconds total (4s + 3s)
      
      return () => clearTimeout(forceRefreshTimer);
    }
  }, [loading, loadingError, toast]);
  
  const handleForceReload = () => {
    setRetryCount(prev => prev + 1);
    setLoadingError(false);
    window.location.reload();
  };
  
  if (loading && !loadingError) {
    return (
      <div className="py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cricket-primary" />
        <p className="text-gray-500">Loading standings...</p>
      </div>
    );
  }
  
  if ((loading && loadingError) || firebaseStatus.error) {
    return (
      <div className="py-8 text-center">
        <CloudOff className="h-8 w-8 mx-auto mb-4 text-amber-500" />
        <p className="text-gray-700 font-medium mb-3">Database Connection Error</p>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
          {firebaseStatus.error ? 
            `Supabase error: ${firebaseStatus.error}. Using local data.` : 
            "We're having trouble connecting to Supabase. Using local data instead."}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleForceReload}
          className="mx-auto flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }
  
  if (tournament.standings.length === 0) {
    return (
      <div className="py-8 text-center">
        <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-amber-500" />
        <p className="text-gray-700 font-medium mb-3">No standings available</p>
        <p className="text-gray-500 mb-6">The tournament standings couldn't be loaded.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-cricket-primary text-white text-sm">
            <th className="px-3 py-3 text-left">Pos</th>
            <th className="px-3 py-3 text-left">Team</th>
            <th className="px-3 py-3 text-center">M</th>
            <th className="px-3 py-3 text-center">W</th>
            <th className="px-3 py-3 text-center">L</th>
            <th className="px-3 py-3 text-center">NRR</th>
            <th className="px-3 py-3 text-center">Pts</th>
            {/* <th className="px-3 py-3 text-center">Last 5</th> */}
          </tr>
        </thead>
        <tbody>
          {tournament.standings.map((teamStats, index) => {
            const team = getTeamById(teamStats.team_id);

            console.log('tournament.standings:', team);
            return (
              <tr 
                key={teamStats.team_id} 
                className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-3 py-3 text-sm font-semibold text-gray-800">
                  {index + 1}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center space-x-2">
                    <TeamLogo teamId={teamStats.team_id} size="sm" />
                    <span className="font-medium text-gray-800">{team?.id}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-sm text-gray-700">
                  {teamStats.played}
                </td>
                <td className="px-3 py-3 text-center text-sm text-gray-700">
                  {teamStats.won}
                </td>
                <td className="px-3 py-3 text-center text-sm text-gray-700">
                  {teamStats.lost}
                </td>
                <td className="px-3 py-3 text-center text-sm text-gray-700">
                  {teamStats.nrr > 0 ? '+' : ''}{teamStats.nrr.toFixed(3)}
                </td>
                <td className="px-3 py-3 text-center font-bold text-cricket-primary">
                  {teamStats.points}
                </td>
                {/* <td className="px-3 py-3">
                  <div className="flex justify-center space-x-1">
                    {teamStats.lastFiveResults?.length > 0 ? (
                      teamStats.lastFiveResults.map((result, idx) => (
                        <MatchResultIcon key={idx} isWin={result} size="sm" />
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </div>
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;
