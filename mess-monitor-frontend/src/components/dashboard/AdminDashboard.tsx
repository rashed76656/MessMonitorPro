import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, BarChart3, Megaphone, MessageSquare } from 'lucide-react';
import { User, FundTransaction, Statistics, Announcement, Feedback } from '@/types';
import { StatsCards } from './StatsCards';
import { BordersTab } from './BordersTab';
import { FundsTab } from './FundsTab';
import { ReportsTab } from './ReportsTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { FeedbacksTab } from './FeedbacksTab';
import { getBorders, getFundTransactions, getAnnouncements, getFeedbacks } from '@/services/firestore';

interface AdminDashboardProps {
  userProfile: User;
  onViewProfile: (border: User) => void;
  onAddTransaction: () => void;
  onEditTransaction: (transaction: FundTransaction) => void;
  onAddAnnouncement: () => void;
  onEditAnnouncement: (announcement: Announcement) => void;
  onViewFeedback: (feedback: Feedback) => void;
}

export const AdminDashboard = ({ 
  userProfile, 
  onViewProfile, 
  onAddTransaction, 
  onEditTransaction,
  onAddAnnouncement,
  onEditAnnouncement,
  onViewFeedback
}: AdminDashboardProps) => {
  const [stats, setStats] = useState<Statistics>({
    totalBorders: 0,
    currentBalance: 0,
    outstandingDues: 0,
    totalFines: 0,
    totalIncome: 0,
    totalExpense: 0,
    newBordersThisMonth: 0,
    pendingFeedbacks: 0,
    activeAnnouncements: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [borders, transactions, announcements, feedbacks] = await Promise.all([
          getBorders(),
          getFundTransactions(),
          getAnnouncements(),
          getFeedbacks()
        ]);

        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpense;

        // Calculate outstanding dues and fines (mock values for now)
        const outstandingDues = borders.length * 200; // Example calculation
        const totalFines = borders.reduce((sum, border) => {
          return sum + (border.fines?.reduce((fineSum, fine) => fineSum + fine.amount, 0) || 0);
        }, 0);

        // Calculate additional stats
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newBordersThisMonth = borders.filter(border => {
          if (!border.joinDate) return false;
          const joinDate = new Date(border.joinDate);
          return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
        }).length;

        const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending').length;

        setStats({
          totalBorders: borders.length,
          currentBalance,
          outstandingDues,
          totalFines,
          totalIncome,
          totalExpense,
          newBordersThisMonth,
          pendingFeedbacks,
          activeAnnouncements: announcements.length,
          unreadNotifications: 0, // Will be calculated per user
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-hidden">
      {/* Dashboard Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-inter font-bold text-3xl text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {userProfile.name}!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-medium text-gray-700">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Action Tabs */}
      <Card className="overflow-hidden">
        <Tabs defaultValue="borders" className="w-full">
          <div className="border-b border-gray-200 px-6 overflow-x-auto">
            <TabsList className="h-auto p-0 bg-transparent flex-nowrap">
              <TabsTrigger 
                value="borders" 
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Borders
              </TabsTrigger>
              <TabsTrigger 
                value="funds"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Fund Management
              </TabsTrigger>
              <TabsTrigger 
                value="announcements"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
              >
                <Megaphone className="mr-2 h-4 w-4" />
                Announcements
              </TabsTrigger>
              <TabsTrigger 
                value="feedbacks"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedbacks
              </TabsTrigger>
              <TabsTrigger 
                value="reports"
                className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-6 py-4"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="borders" className="mt-0">
            <BordersTab onViewProfile={onViewProfile} />
          </TabsContent>

          <TabsContent value="funds" className="mt-0">
            <FundsTab 
              onAddTransaction={onAddTransaction}
              onEditTransaction={onEditTransaction}
              stats={stats}
            />
          </TabsContent>

          <TabsContent value="announcements" className="mt-0">
            <AnnouncementsTab 
              onAddAnnouncement={onAddAnnouncement}
              onEditAnnouncement={onEditAnnouncement}
            />
          </TabsContent>

          <TabsContent value="feedbacks" className="mt-0">
            <FeedbacksTab onViewFeedback={onViewFeedback} />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsTab stats={stats} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
