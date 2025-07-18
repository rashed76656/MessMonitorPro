import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import { FundTransaction, Statistics } from '@/types';
import { listenToFundTransactions, deleteFundTransaction } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

interface FundsTabProps {
  onAddTransaction: () => void;
  onEditTransaction: (transaction: FundTransaction) => void;
  stats: Statistics;
}

export const FundsTab = ({ onAddTransaction, onEditTransaction, stats }: FundsTabProps) => {
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenToFundTransactions((transactionsData) => {
      setTransactions(transactionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteFundTransaction(id);
        toast({
          title: "Transaction deleted",
          description: "The transaction has been removed successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading fund data...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-inter font-semibold text-xl text-gray-900">Fund Management</h3>
        <Button onClick={onAddTransaction} className="bg-secondary hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Fund Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <ArrowUp className="text-green-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-green-600">Total Income</p>
                <p className="text-2xl font-bold text-green-700">
                  ৳ {stats.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <ArrowDown className="text-red-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-red-600">Total Expense</p>
                <p className="text-2xl font-bold text-red-700">
                  ৳ {stats.totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Wallet className="text-blue-600 text-2xl mr-3" />
              <div>
                <p className="text-sm text-blue-600">Current Balance</p>
                <p className="text-2xl font-bold text-blue-700">
                  ৳ {stats.currentBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions found. Add your first transaction above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Trx ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {transaction.date}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.type === 'income' ? 'default' : 'destructive'}
                          className={transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        >
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ৳ {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.fromTo}</TableCell>
                      <TableCell>{transaction.purpose}</TableCell>
                      <TableCell className="text-gray-500">
                        {transaction.trxId || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditTransaction(transaction)}
                            className="text-primary hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
