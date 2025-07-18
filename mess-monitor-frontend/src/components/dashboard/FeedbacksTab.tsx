import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, MessageSquare, Eye, CheckCircle } from 'lucide-react';
import { Feedback } from '@/types';
import { listenToFeedbacks, updateFeedback } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

interface FeedbacksTabProps {
  onViewFeedback: (feedback: Feedback) => void;
}

export const FeedbacksTab = ({ onViewFeedback }: FeedbacksTabProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenToFeedbacks((feedbacksData) => {
      setFeedbacks(feedbacksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAsReviewed = async (feedback: Feedback) => {
    try {
      await updateFeedback(feedback.id, {
        status: 'reviewed',
        respondedAt: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Feedback marked as reviewed",
        description: "The feedback status has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      food: 'bg-orange-100 text-orange-800',
      service: 'bg-blue-100 text-blue-800',
      management: 'bg-purple-100 text-purple-800',
      facilities: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const pendingCount = feedbacks.filter(f => f.status === 'pending').length;
  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
    : 0;

  if (loading) {
    return <div className="text-center py-8">Loading feedbacks...</div>;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-inter font-semibold text-xl text-gray-900">Feedback Management</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="text-primary text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Feedbacks</p>
                <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="text-yellow-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="text-orange-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedbacks Table */}
      <Card>
        <CardContent className="p-0">
          {feedbacks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No feedbacks submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Border</TableHead>
                    <TableHead className="min-w-[150px]">Subject</TableHead>
                    <TableHead className="min-w-[100px]">Category</TableHead>
                    <TableHead className="min-w-[120px]">Rating</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">{feedback.borderName}</TableCell>
                      <TableCell className="max-w-xs truncate">{feedback.subject}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(feedback.category)}>
                          {feedback.category.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderStars(feedback.rating)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {feedback.createdAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewFeedback(feedback)}
                            className="text-primary hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {feedback.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsReviewed(feedback)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
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