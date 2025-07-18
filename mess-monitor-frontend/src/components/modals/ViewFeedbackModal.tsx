import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, User, Calendar, MessageSquare, Loader2 } from 'lucide-react';
import { Feedback } from '@/types';
import { updateFeedback } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

interface ViewFeedbackModalProps {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewFeedbackModal = ({ feedback, isOpen, onClose }: ViewFeedbackModalProps) => {
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!feedback) return null;

  const handleRespond = async () => {
    setLoading(true);
    try {
      await updateFeedback(feedback.id, {
        adminResponse,
        respondedAt: new Date().toISOString().split('T')[0],
        status: 'resolved'
      });
      
      toast({
        title: "Response sent",
        description: "Your response has been saved and the feedback is marked as resolved.",
      });
      
      onClose();
      setAdminResponse('');
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-inter font-semibold text-lg flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Feedback Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{feedback.subject}</h3>
              <div className="flex space-x-2">
                <Badge className={getCategoryColor(feedback.category)}>
                  {feedback.category.toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(feedback.status)}>
                  {feedback.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {feedback.borderName}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {feedback.createdAt}
              </div>
              <div className="flex items-center">
                Rating: {renderStars(feedback.rating)}
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <h4 className="font-medium mb-2">Message:</h4>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
            </div>
          </div>

          {/* Previous Admin Response (if any) */}
          {feedback.adminResponse && (
            <div>
              <h4 className="font-medium mb-2">Previous Admin Response:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{feedback.adminResponse}</p>
                {feedback.respondedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Responded on: {feedback.respondedAt}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Admin Response Section */}
          {feedback.status !== 'resolved' && (
            <div>
              <h4 className="font-medium mb-2">Admin Response:</h4>
              <Textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Write your response to this feedback..."
                className="min-h-[120px]"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {feedback.status !== 'resolved' && (
              <Button 
                onClick={handleRespond}
                className="flex-1 bg-primary hover:bg-blue-700"
                disabled={loading || !adminResponse.trim()}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Response & Mark Resolved
              </Button>
            )}
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};