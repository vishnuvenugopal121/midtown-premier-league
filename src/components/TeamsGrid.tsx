
import { useTournament } from '@/context/TournamentContext';
import TeamLogo from './TeamLogo';
import { Users } from 'lucide-react';

const TeamsGrid = () => {
  const { tournament } = useTournament();

  console.log('tournament', tournament);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {tournament.teams.map((team) => (
        <div key={team.id} className="cricket-card">
          <div 
            className="h-20 flex items-center justify-center" 
            style={{ backgroundColor: team.primaryColor }}
          >
            <TeamLogo teamId={team.id} size="lg" className="w-16 h-16" />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-center mb-1">{team.name}</h3>
            
            {team.captain && (
              <div className="text-center text-sm text-gray-600 mb-3">
                Captain: <span className="font-medium">{team.captain}</span>
              </div>
            )}
            
            {team.players && team.players.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center text-xs text-cricket-primary font-medium mb-2">
                  <Users size={14} className="mr-1" />
                  SQUAD
                </div>
                <ul className="text-sm space-y-1">
                  {team.players.map((player) => (
                    <li key={player} className="text-gray-700">
                      {player}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsGrid;
