import { useTournament } from "@/context/TournamentContext";
import TeamLogo from "./TeamLogo";
import { formatDate, formatTime } from "@/lib/utils";
import { Clock, MapPin } from "lucide-react";

const MatchFixtures = () => {
  const { tournament, getTeamById } = useTournament();

  // Group matches by date
  const matchesByDate = tournament.matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, typeof tournament.matches>);

  // Sort dates
  const sortedDates = Object.keys(matchesByDate).sort();

  console.log("Matches by Date:", matchesByDate);

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const matchesOnDate = matchesByDate[date];
        const formattedDate = formatDate(new Date(date));

        return (
          <div key={date} className="relative">
            <div className="sticky top-[72px] z-10 bg-white py-2 border-b">
              <h3 className="font-semibold text-lg text-gray-800">
                {formattedDate}
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              {matchesOnDate.map((match) => {
                console.log("Match:1234", match);
                const teamA = getTeamById(match.team1);
                const teamB = getTeamById(match.team2);
                console.log("Match:1234 A,B", teamA, teamB);

                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {/* Team A */}
                      <div className="flex flex-col items-center justify-center">
                        <TeamLogo teamId={teamA?.id} size="lg" />
                        <div className="mt-3 text-center">
                          <div className="font-semibold text-gray-900">
                            {teamA?.id || "TBD"}
                          </div>
                          {match.status === "completed" && match.result && (
                            <div
                              className="text-sm font-medium"
                              style={{
                                color:
                                  match.result.winner === match.teamA
                                    ? teamA?.primaryColor
                                    : "text-gray-500",
                              }}
                            >
                              {match.result.winner === match.teamA
                                ? match.result.winningTeamScore
                                : match.result.losingTeamScore}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Match Info */}
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div
                          className="text-sm font-medium"
                          style={{
                            color: match.isFinal ? "#D4AF37" : "#666",
                          }}
                        >
                          {match.isFinal
                            ? "FINAL"
                            : `Match #${match.match_id}`}
                        </div>
                        <div className="text-2xl font-bold text-gray-400">
                          VS
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {match.venue}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <p className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {formatTime(match.date)}{" "}
                          </p>
                          
                        </div>
                        {match.status === "completed" && match.result && (
                          <div
                            className="mt-2 text-sm text-center font-medium"
                            style={{
                              color: getTeamById(match.result.winner)
                                ?.primaryColor,
                            }}
                          >
                            {getTeamById(match.result.winner)?.shortName} won by{" "}
                            {match.result.winMargin}
                          </div>
                        )}
                      </div>

                      {/* Team B */}
                      <div className="flex flex-col items-center justify-center">
                        <TeamLogo teamId={teamB?.id} size="lg" />
                        <div className="mt-3 text-center">
                          <div className="font-semibold text-gray-900">
                            {teamB?.id || "TBD"}
                          </div>
                          {match.status === "completed" && match.result && (
                            <div
                              className="text-sm font-medium"
                              style={{
                                color:
                                  match.result.winner === match.teamB
                                    ? teamB?.primaryColor
                                    : "text-gray-500",
                              }}
                            >
                              {match.result.winner === match.teamB
                                ? match.result.winningTeamScore
                                : match.result.losingTeamScore}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchFixtures;
