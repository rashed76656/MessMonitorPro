import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, AlertTriangle, Receipt, UserPlus, MessageSquare, Megaphone, Bell } from 'lucide-react';
import { Statistics } from '@/types';

interface StatsCardsProps {
  stats: Statistics;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Borders',
      value: stats.totalBorders.toString(),
      icon: Users,
      color: 'bg-blue-100 text-primary',
    },
    {
      title: 'Current Balance',
      value: `৳ ${stats.currentBalance.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100 text-secondary',
    },
    {
      title: 'Outstanding Dues',
      value: `৳ ${stats.outstandingDues.toLocaleString()}`,
      icon: AlertTriangle,
      color: 'bg-orange-100 text-accent',
    },
    {
      title: 'Total Fines',
      value: `৳ ${stats.totalFines.toLocaleString()}`,
      icon: Receipt,
      color: 'bg-red-100 text-red-500',
    },
    {
      title: 'New This Month',
      value: stats.newBordersThisMonth.toString(),
      icon: UserPlus,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Pending Feedbacks',
      value: stats.pendingFeedbacks.toString(),
      icon: MessageSquare,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Active Announcements',
      value: stats.activeAnnouncements.toString(),
      icon: Megaphone,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications.toString(),
      icon: Bell,
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
