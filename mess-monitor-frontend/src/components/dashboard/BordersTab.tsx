import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye } from 'lucide-react';
import { User } from '@/types';
import { listenToBorders } from '@/services/firestore';

interface BordersTabProps {
  onViewProfile: (border: User) => void;
}

export const BordersTab = ({ onViewProfile }: BordersTabProps) => {
  const [borders, setBorders] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToBorders((bordersData) => {
      setBorders(bordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBorders = borders.filter(border =>
    border.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    border.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getBalanceColor = (border: User) => {
    if (border.owesTo) return 'text-red-600';
    if (border.getsFrom) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return <div className="text-center py-8">Loading borders...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-inter font-semibold text-xl text-gray-900">Border Management</h3>
        <div className="flex space-x-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search borders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>

      {filteredBorders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No borders found matching your search.' : 'No borders registered yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBorders.map((border) => (
            <Card key={border.uid} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getInitials(border.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{border.name}</h4>
                    <p className="text-sm text-gray-600">{border.department}</p>
                    <p className="text-sm text-gray-500">{border.phone}</p>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProfile(border)}
                      className="text-primary hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-600">
                    Duty: <span className="font-medium">{border.duty || 'Not assigned'}</span>
                  </span>
                  <span className={getBalanceColor(border)}>
                    {border.owesTo && `Owes: ${border.owesTo}`}
                    {border.getsFrom && `Gets: ${border.getsFrom}`}
                    {!border.owesTo && !border.getsFrom && 'Balanced'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
