import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { FundTransaction } from '@/types';
import { addFundTransaction, updateFundTransaction } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

const fundSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense'], { required_error: 'Please select transaction type' }),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  fromTo: z.string().min(1, 'From/To field is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  trxId: z.string().optional(),
});

type FundFormData = z.infer<typeof fundSchema>;

interface FundModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: FundTransaction | null;
}

export const FundModal = ({ isOpen, onClose, transaction }: FundModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FundFormData>({
    resolver: zodResolver(fundSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: undefined,
      amount: 0,
      fromTo: '',
      purpose: '',
      trxId: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        date: transaction.date,
        type: transaction.type,
        amount: transaction.amount,
        fromTo: transaction.fromTo,
        purpose: transaction.purpose,
        trxId: transaction.trxId || '',
      });
    } else {
      form.reset({
        date: new Date().toISOString().split('T')[0],
        type: undefined,
        amount: 0,
        fromTo: '',
        purpose: '',
        trxId: '',
      });
    }
  }, [transaction, form]);

  const onSubmit = async (data: FundFormData) => {
    setLoading(true);
    try {
      if (transaction) {
        await updateFundTransaction(transaction.id, data);
        toast({
          title: "Transaction updated",
          description: "The transaction has been updated successfully.",
        });
      } else {
        await addFundTransaction(data);
        toast({
          title: "Transaction added",
          description: "The transaction has been added successfully.",
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-inter font-semibold text-lg">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (৳)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From / To</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-blue-700"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {transaction ? 'Update Transaction' : 'Save Transaction'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
