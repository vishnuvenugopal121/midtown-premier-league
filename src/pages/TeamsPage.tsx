
import Navbar from '@/components/Navbar';
import TeamsGrid from '@/components/TeamsGrid';

const TeamsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Teams</h1>
        
        <TeamsGrid />
      </main>
    </div>
  );
};

export default TeamsPage;
