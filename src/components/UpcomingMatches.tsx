
import { useTournament } from '@/context/TournamentContext';
import TeamLogo from './TeamLogo';
import { formatDate, formatTime } from '@/lib/utils';

interface UpcomingMatchesProps {
  count?: number;
}

const UpcomingMatches = ({ count = 2 }: UpcomingMatchesProps) => {
  const { getUpcomingMatches, getTeamById } = useTournament();
  const upcomingMatches = getUpcomingMatches(count);

  if (upcomingMatches.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No upcoming matches scheduled.</p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {upcomingMatches.map((match) => {
        console.log('Match:', match);
        const teamA = getTeamById(match.team1);
        const teamB = getTeamById(match.team2);
        const matchDate = new Date(match.date);

        console.log('Match Date:', matchDate, teamA, teamB);

        return (
          <div key={match.match_id} className="cricket-card">
            <div className="bg-cricket-primary p-3 text-white">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">
                  {match.isFinal ? 'FINAL' : `Match #${match.match_id}`}
                </div>
                <div className="text-sm">{formatDate(matchDate)}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-center">
                  <TeamLogo teamId={match.team1} size="lg" />
                  <span className="mt-2 font-semibold text-black">{teamA?.id || 'TBD'}</span>
                </div>
                <div className="text-xl font-bold text-gray-500">VS</div>
                <div className="flex flex-col items-center">
                  <TeamLogo teamId={match.team2} size="lg" />
                  <span className="mt-2 font-semibold  text-black">{teamB?.id || 'TBD'}</span>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                <div>{match.venue}</div>
                <div className="font-medium text-cricket-primary mt-1">{formatDate(matchDate)}</div>
                <div className="font-medium text-cricket-primary mt-1">{formatTime(matchDate)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingMatches;
