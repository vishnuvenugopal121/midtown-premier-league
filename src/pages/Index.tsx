import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTournament } from '@/context/TournamentContext';
import Navbar from '@/components/Navbar';
import PointsTable from '@/components/PointsTable';
import UpcomingMatches from '@/components/UpcomingMatches';
import CountdownTimer from '@/components/CountdownTimer';
import MatchDayAgenda from '@/components/MatchDayAgenda';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const Index = () => {
  const { getUpcomingMatches, getTeamById } = useTournament();
  const upcomingMatches = getUpcomingMatches(1);
  const hasUpcomingMatch = upcomingMatches.length > 0;
  const [showConfetti, setShowConfetti] = useState(false);

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
                      <Link to="/points-table">View Results</Link>
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
        
        {/* Points Table Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Points Table</h2>
          <PointsTable />
        </section>
      </main>
    </div>
  );
};

export default Index;
