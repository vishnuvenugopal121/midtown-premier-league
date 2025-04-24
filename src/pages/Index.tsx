import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTournament } from '@/context/TournamentContext';
import Navbar from '@/components/Navbar';
import PointsTable from '@/components/PointsTable';
import UpcomingMatches from '@/components/UpcomingMatches';
import CountdownTimer from '@/components/CountdownTimer';
import MatchDayAgenda from '@/components/MatchDayAgenda';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const Index = () => {
  const { getUpcomingMatches } = useTournament();
  const upcomingMatches = getUpcomingMatches(1);
  const hasUpcomingMatch = upcomingMatches.length > 0;
  
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
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm text-center">
                <Trophy size={48} className="mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Tournament Completed!</h2>
                <p className="opacity-90 mb-4">Check out the final standings and results.</p>
                <Button asChild className="bg-white text-cricket-primary hover:bg-white/90">
                  <Link to="/points-table">View Results</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Points Table Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Points Table</h2>
            <Button asChild variant="outline">
              <Link to="/points-table">View Full Table</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <PointsTable />
          </div>
        </section>
        
        {/* Upcoming Matches Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Matches</h2>
            <Button asChild variant="outline">
              <Link to="/fixtures">View All Fixtures</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            <UpcomingMatches count={2} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
