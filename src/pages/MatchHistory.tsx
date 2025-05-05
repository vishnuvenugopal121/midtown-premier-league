import Navbar from '@/components/Navbar';
import MatchStatistics from '@/components/MatchStatistics';

const MatchHistory = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <MatchStatistics />
      </main>
    </div>
  );
};

export default MatchHistory; 