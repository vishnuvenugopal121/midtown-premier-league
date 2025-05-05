import { useState, useEffect } from 'react';
import { useTournament } from '@/context/TournamentContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import TeamLogo from './TeamLogo';
import { formatDate, formatTime } from '@/lib/utils';
import mockStats from '@/data/mock_statistics.json';

interface BattingStats {
  player: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  out: boolean;
  dismissalType?: string;
  dismissedBy?: string;
}

interface BowlingStats {
  player: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: number;
  dots: number;
}

const MatchStatistics = () => {
  const { tournament, getTeamById } = useTournament();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  // Filter completed matches
  const completedMatches = tournament.matches.filter(match => match.status === 'completed');

  // Group matches by date
  const matchesByDate = completedMatches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, typeof tournament.matches>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(matchesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const renderMatchList = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Match History</h2>
      <div className="space-y-8">
        {/* Final Match - Static */}
        <div>
          <div className="sticky top-[72px] z-10 bg-white py-2 border-b">
            <h3 className="font-semibold text-lg text-gray-800">
              Final Match · {formatDate('2025-05-04T21:20:00')}
            </h3>
          </div>

          <div className="grid gap-4 mt-4">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-2 border-[#D4AF37]"
              onClick={() => setSelectedMatch('final')}>
              <CardContent className="p-4">
                <div className="text-sm mb-4 flex items-center gap-2">
                  <span className="bg-[#D4AF37] text-white px-2 py-0.5 rounded-full text-xs font-semibold">FINAL</span>
                  <span className="text-muted-foreground">MPL · Season 1</span>
                </div>
                <div className="md:flex md:items-center md:justify-between md:gap-4">
                  {/* Mobile View */}
                  <div className="flex md:hidden w-full">
                    <div className="w-full grid grid-cols-[auto,1fr,auto] items-center gap-4">
                      <div className="flex items-center gap-2">
                        <TeamLogo teamId="HU" size="lg" />
                        <span className="font-bold text-base">HU</span>
                      </div>

                      <div className="flex-1 text-center">
                        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                          <div className="text-right">
                            <span className="font-mono text-lg font-bold">102/0</span>
                          </div>
                          <div className="text-muted-foreground font-medium px-1">vs</div>
                          <div className="text-left">
                            <span className="font-mono text-lg font-bold">41/2</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <TeamLogo teamId="TT" size="lg" />
                        <span className="font-bold text-base">TT</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                    <div className="flex flex-col items-center gap-2 min-w-[100px]">
                      <TeamLogo teamId="HU" size="lg" />
                      <span className="font-bold text-lg">HU</span>
                    </div>

                    <div className="flex-1 text-center">
                      <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 mb-2">
                        <div className="text-right">
                          <span className="font-mono text-xl font-bold">102/0</span>
                          <span className="text-sm text-muted-foreground ml-1">(6)</span>
                        </div>
                        <div className="text-muted-foreground font-medium">vs</div>
                        <div className="text-left">
                          <span className="font-mono text-xl font-bold">41/2</span>
                          <span className="text-sm text-muted-foreground ml-1">(6)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 min-w-[100px]">
                      <TeamLogo teamId="TT" size="lg" />
                      <span className="font-bold text-lg">TT</span>
                    </div>
                  </div>

                  {/* Common elements for both views */}
                  <div className="w-full mt-2">
                    <div className="text-sm font-medium text-[#D4AF37] text-center">
                      HU won by 61 runs
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mt-2">
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1" />
                        Club-T Turf, Kochi
                      </div>
                      <span className="hidden md:inline">·</span>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatTime('2025-05-04T21:20:00')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dynamic Matches */}
        {sortedDates.map((date) => {
          const matchesOnDate = matchesByDate[date];
          const formattedDate = formatDate(new Date(date));

          return (
            <div key={date} className="space-y-4">
              <div className="sticky top-[72px] z-10 bg-white py-2 border-b">
                <h3 className="font-semibold text-lg text-gray-800">
                  {formattedDate}
                </h3>
              </div>

              <div className="grid gap-4">
                {matchesOnDate.map((match) => {
                  const teamA = getTeamById(match.team1);
                  const teamB = getTeamById(match.team2);

                  return (
                    <Card key={match.match_id} 
                          className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                          onClick={() => setSelectedMatch(match.match_id)}>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          MPL · {formatDate(new Date(match.date))}
                        </div>
                        <div className="md:flex md:items-center md:justify-between md:gap-4">
                          {/* Mobile View */}
                          <div className="flex md:hidden w-full">
                            <div className="w-full grid grid-cols-[auto,1fr,auto] items-center gap-4">
                              <div className="flex items-center gap-2">
                                <TeamLogo teamId={teamA?.id} size="lg" />
                                <span className="font-bold text-base">{teamA?.id}</span>
                              </div>

                              <div className="flex-1 text-center">
                                {match.result && (
                                  <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                                    <div className="text-right">
                                      <span className="font-mono text-lg font-bold">
                                        {match.result.winner === match.team1 
                                          ? match.result.winningTeamScore 
                                          : match.result.losingTeamScore}
                                      </span>
                                    </div>
                                    <div className="text-muted-foreground font-medium px-1">vs</div>
                                    <div className="text-left">
                                      <span className="font-mono text-lg font-bold">
                                        {match.result.winner === match.team2 
                                          ? match.result.winningTeamScore 
                                          : match.result.losingTeamScore}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <TeamLogo teamId={teamB?.id} size="lg" />
                                <span className="font-bold text-base">{teamB?.id}</span>
                              </div>
                            </div>
                          </div>

                          {/* Desktop View */}
                          <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                            <div className="flex flex-col items-center gap-2 min-w-[100px]">
                              <TeamLogo teamId={teamA?.id} size="lg" />
                              <span className="font-bold text-lg">{teamA?.id}</span>
                            </div>

                            <div className="flex-1 text-center">
                              {match.result && (
                                <>
                                  <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 mb-2">
                                    <div className="text-right">
                                      <span className="font-mono text-xl font-bold">
                                        {match.result.winner === match.team1 
                                          ? match.result.winningTeamScore 
                                          : match.result.losingTeamScore}
                                      </span>
                                    </div>
                                    <div className="text-muted-foreground font-medium">vs</div>
                                    <div className="text-left">
                                      <span className="font-mono text-xl font-bold">
                                        {match.result.winner === match.team2 
                                          ? match.result.winningTeamScore 
                                          : match.result.losingTeamScore}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex flex-col items-center gap-2 min-w-[100px]">
                              <TeamLogo teamId={teamB?.id} size="lg" />
                              <span className="font-bold text-lg">{teamB?.id}</span>
                            </div>
                          </div>

                          {/* Common elements for both views */}
                          <div className="w-full mt-2">
                            {match.result && (
                              <div className="text-sm font-medium text-primary text-center">
                                {getTeamById(match.result.winner)?.id} won by {match.result.winMargin}
                              </div>
                            )}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mt-2">
                              <div className="flex items-center">
                                <MapPin size={12} className="mr-1" />
                                {match.venue}
                              </div>
                              <span className="hidden md:inline">·</span>
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {formatTime(match.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMatchDetails = () => {
    if (!selectedMatch) return null;
    
    const match = tournament.matches.find(m => m.match_id === selectedMatch);
    if (!match) return null;

    const teamA = getTeamById(match.team1);
    const teamB = getTeamById(match.team2);
    
    // Get match statistics from mock data
    const matchStats = mockStats.matches[selectedMatch === 'final' ? 'final' : `match${match.match_id}`];
    
    const renderBattingStats = (teamStats: any) => (
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Batter</TableHead>
            <TableHead className="text-right">R</TableHead>
            <TableHead className="text-right">B</TableHead>
            <TableHead className="text-right">4s</TableHead>
            <TableHead className="text-right">6s</TableHead>
            <TableHead className="text-right">SR</TableHead>
            <TableHead>Dismissal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamStats?.batting.map((batter: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{batter.player}</TableCell>
              <TableCell className="text-right">{batter.runs}</TableCell>
              <TableCell className="text-right">{batter.balls}</TableCell>
              <TableCell className="text-right">{batter.fours}</TableCell>
              <TableCell className="text-right">{batter.sixes}</TableCell>
              <TableCell className="text-right">{batter.strikeRate.toFixed(2)}</TableCell>
              <TableCell>
                {batter.out ? (
                  `${batter.dismissalType} ${batter.dismissedBy ? `by ${batter.dismissedBy}` : ''}`
                ) : (
                  'not out'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    const renderBowlingStats = (teamStats: any) => (
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Bowler</TableHead>
            <TableHead className="text-right">O</TableHead>
            <TableHead className="text-right">M</TableHead>
            <TableHead className="text-right">R</TableHead>
            <TableHead className="text-right">W</TableHead>
            <TableHead className="text-right">ECON</TableHead>
            <TableHead className="text-right">Dots</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamStats?.bowling.map((bowler: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{bowler.player}</TableCell>
              <TableCell className="text-right">{bowler.overs}</TableCell>
              <TableCell className="text-right">{bowler.maidens}</TableCell>
              <TableCell className="text-right">{bowler.runs}</TableCell>
              <TableCell className="text-right">{bowler.wickets}</TableCell>
              <TableCell className="text-right">{bowler.economy.toFixed(2)}</TableCell>
              <TableCell className="text-right">{bowler.dots}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSelectedMatch(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <TeamLogo teamId={teamA?.id} size="lg" />
              <span className="text-xl font-bold">vs</span>
              <TeamLogo teamId={teamB?.id} size="lg" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                {teamA?.id} vs {teamB?.id}
              </h2>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <MapPin size={14} />
                {match.venue}
                <span>·</span>
                <Clock size={14} />
                {formatTime(match.date)}
              </div>
            </div>
          </div>
        </div>

        {/* First Innings */}
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-3">
              <TeamLogo teamId={matchStats?.team1.id} size="sm" />
              <CardTitle className="text-xl">
                {getTeamById(matchStats?.team1.id)?.name} Innings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Batting</h4>
                {renderBattingStats(matchStats?.team1)}
              </div>
              <div>
                <h4 className="font-semibold mb-4">Bowling</h4>
                {renderBowlingStats(matchStats?.team2)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Innings */}
        <Card>
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-3">
              <TeamLogo teamId={matchStats?.team2.id} size="sm" />
              <CardTitle className="text-xl">
                {getTeamById(matchStats?.team2.id)?.name} Innings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Batting</h4>
                {renderBattingStats(matchStats?.team2)}
              </div>
              <div>
                <h4 className="font-semibold mb-4">Bowling</h4>
                {renderBowlingStats(matchStats?.team1)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {selectedMatch ? renderMatchDetails() : renderMatchList()}
    </div>
  );
};

export default MatchStatistics; 