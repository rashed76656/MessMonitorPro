import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import { Statistics } from '@/types';

interface ReportsTabProps {
  stats: Statistics;
}

export const ReportsTab = ({ stats }: ReportsTabProps) => {
  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    alert('PDF export functionality will be implemented');
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    alert('Excel export functionality will be implemented');
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-inter font-semibold text-xl text-gray-900">Reports & Analytics</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button onClick={handleExportPDF} className="bg-primary hover:bg-blue-700 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleExportExcel} className="bg-secondary hover:bg-green-700 w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Income</span>
              <span className="font-medium text-green-600">
                ৳ {stats.totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Expense</span>
              <span className="font-medium text-red-600">
                ৳ {stats.totalExpense.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Net Savings</span>
              <span className="font-medium text-blue-600">
                ৳ {stats.currentBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Dues</span>
              <span className="font-medium text-orange-600">
                ৳ {stats.outstandingDues.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Border Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Border Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Borders</span>
              <Badge className="bg-green-100 text-green-800">
                {stats.totalBorders}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Defaulters</span>
              <Badge className="bg-red-100 text-red-800">
                3
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duty Performers</span>
              <Badge className="bg-blue-100 text-blue-800">
                {Math.max(0, stats.totalBorders - 3)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fined Borders</span>
              <Badge className="bg-orange-100 text-orange-800">
                5
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
