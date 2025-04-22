
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MatchFixtures from '@/components/MatchFixtures';
import AdminMatchForm from '@/components/AdminMatchForm';
import { useTournament } from '@/context/TournamentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Match } from '@/types/cricket';

const FixturesPage = () => {
  const { tournament, isAdmin } = useTournament();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
  };
  
  const handleCloseDialog = () => {
    setSelectedMatch(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Match Fixtures</h1>
        </div>
        
        {isAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-amber-700 mb-1">Admin Mode</h2>
            <p className="text-xs text-amber-600 mb-0">
              You can update match results by selecting a scheduled match.
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <MatchFixtures />
        </div>
        
        {/* Admin Match Edit Dialog */}
        {selectedMatch && (
          <Dialog open={!!selectedMatch} onOpenChange={handleCloseDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Match Result</DialogTitle>
              </DialogHeader>
              <AdminMatchForm match={selectedMatch} onClose={handleCloseDialog} />
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default FixturesPage;
