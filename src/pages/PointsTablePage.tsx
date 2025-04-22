
import Navbar from '@/components/Navbar';
import PointsTable from '@/components/PointsTable';

const PointsTablePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Points Table</h1>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <PointsTable />
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-cricket-primary">How Points Are Calculated</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Win = 2 points</li>
            <li>• Loss = 0 points</li>
            <li>• No Result (NR) = 1 point each</li>
            <li>• Teams are ranked by points, then by Net Run Rate (NRR)</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default PointsTablePage;
