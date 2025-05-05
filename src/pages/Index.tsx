import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTournament } from '@/context/TournamentContext';
import Navbar from '@/components/Navbar';
import PointsTable from '@/components/PointsTable';
import UpcomingMatches from '@/components/UpcomingMatches';
import CountdownTimer from '@/components/CountdownTimer';
import MatchDayAgenda from '@/components/MatchDayAgenda';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Crown, MapPin, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, CardContent } from '@/components/ui/card';
import TeamLogo from '@/components/TeamLogo';
import { formatTime } from '@/lib/utils';
import winnersImg from '@/assets/winners.jpeg';
import runnerupImg from '@/assets/runnerup.jpeg';
import mplteamImg from '@/assets/mplteam.jpeg';

const Index = () => {
  const { getUpcomingMatches, getTeamById } = useTournament();
  const upcomingMatches = getUpcomingMatches(1);
  const hasUpcomingMatch = upcomingMatches.length > 0;
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasUpcomingMatch) {
      // Trigger confetti when tournament is completed
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      setShowConfetti(true);
    }
  }, [hasUpcomingMatch]);

  const winningTeam = {
    id: "HU",
    nrr: 2.445,
    logo: "https://preview--cricket-clash-tracker.lovable.app/lovable-uploads/0f599c54-b539-493e-8905-d1f39a500422.png",
    name: "HEXARCHS UNITED",
    captain: "Indrajith",
    players: [
      "Indrajith",
      "Melbin",
      "Ayyappa Das",
      "Jomon",
      "Shyam",
      "Hari"
    ],
    primaryColor: "#DAA520"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="cricket-gradient rounded-lg text-white p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Midtown Premier League - Season 1</h1>
            <p className="text-lg opacity-90 mb-6">The ultimate cricket tournament</p>
            
            {hasUpcomingMatch ? (
              <>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 md:p-6 backdrop-blur-sm mb-6">
                  <h2 className="text-xl font-semibold mb-3">Next Match</h2>
                  <UpcomingMatches count={1} />
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2 text-center">Countdown to Match</h3>
                    <CountdownTimer 
                      targetDateTime={upcomingMatches[0].date}
                    />
                  </div>
                </div>

                {/* Separate box for Match Day Agenda */}
                <div className="bg-white bg-opacity-10 rounded-lg p-4 md:p-6 backdrop-blur-sm">
                  <MatchDayAgenda />
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden">
                {/* Celebration Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#DAA520]/20 to-transparent animate-pulse-slow"></div>
                
                {/* Winning Team Celebration */}
                <div className="relative bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#DAA520] rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <img 
                        src={winningTeam.logo} 
                        alt={winningTeam.name} 
                        className="w-32 h-32 object-contain relative z-10 animate-bounce"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Crown className="w-8 h-8 text-[#DAA520]" />
                    <h2 className="text-3xl font-bold text-[#DAA520]">CHAMPIONS!</h2>
                    <Crown className="w-8 h-8 text-[#DAA520]" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-2">{winningTeam.name}</h3>
                  <p className="text-lg mb-6">Captain: {winningTeam.captain}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {winningTeam.players.map((player, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                        <Star className="w-4 h-4 text-[#DAA520]" />
                        <span>{player}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <Button asChild className="bg-[#DAA520] hover:bg-[#DAA520]/90">
                      <Link to="/points-table">View Points Table</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520]/10">
                      <Link to="/matches">Match History</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Final Match Section */}
        {!hasUpcomingMatch && (
          <>
            <section className="mb-12">
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-2 border-[#DAA520]"
                onClick={() => navigate('/matches?final=1')}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/matches?final=1'); }}
              >
                <CardContent className="p-4">
                  <div className="text-sm mb-4 flex items-center gap-2">
                    <span className="bg-[#DAA520] text-white px-2 py-0.5 rounded-full text-xs font-semibold">FINAL</span>
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
                      <div className="text-sm font-medium text-[#DAA520] text-center">
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
            </section>

            {/* Tournament Photos Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Tournament Memories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Champions Photo */}
                <Card className="overflow-hidden group">
                  <div className="relative">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={winnersImg} 
                        alt="MPL Champions - HEXARCHS UNITED" 
                        className="w-full h-full object-cover object-[center_25%] transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-[#DAA520]" />
                          <span className="text-[#DAA520] font-semibold">Champions</span>
                        </div>
                        <h3 className="font-bold">HEXARCHS UNITED</h3>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Runners-up Photo */}
                <Card className="overflow-hidden group">
                  <div className="relative">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={runnerupImg} 
                        alt="MPL Runners-up - THE TARGARYANS" 
                        className="w-full h-full object-cover object-[center_25%] transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-silver" />
                          <span className="text-silver font-semibold">Runners-up</span>
                        </div>
                        <h3 className="font-bold">THE TARGARYANS</h3>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Team Photo */}
                <Card className="overflow-hidden group md:col-span-2 lg:col-span-1">
                  <div className="relative">
                    <div className="aspect-[21/10] overflow-hidden">
                      <img 
                        src={mplteamImg} 
                        alt="MPL Season 1 Teams" 
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="w-4 h-4 text-white" />
                          <span className="font-semibold">Season 1</span>
                        </div>
                        <h3 className="font-bold">MPL Teams</h3>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          </>
        )}
        
        {/* Points Table Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Points Table (League Stage)</h2>
          <PointsTable />
        </section>
      </main>
    </div>
  );
};

export default Index;
