import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, Notification } from '@/types';
import { logout } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Utensils, Bell, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { listenToNotifications } from '@/services/firestore';

interface NavbarProps {
  user: FirebaseUser | null;
  userProfile: User | null;
  onShowNotifications?: () => void;
  onShowFeedback?: () => void;
}

export const Navbar = ({ user, userProfile, onShowNotifications, onShowFeedback }: NavbarProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile?.role === 'border') {
      const unsubscribe = listenToNotifications(userProfile.uid, (notificationsData) => {
        setNotifications(notificationsData);
      });
      return () => unsubscribe();
    }
  }, [userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || !userProfile) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Utensils className="text-primary text-2xl mr-2" />
              <span className="font-inter font-bold text-xl text-gray-800">Mess Monitor</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, {userProfile.role === 'admin' ? 'Admin' : userProfile.name}
            </span>
            
            {/* Border-specific actions */}
            {userProfile.role === 'border' && (
              <>
                {/* Notifications Button */}
                <div className="relative">
                  <Button
                    onClick={onShowNotifications}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </div>
                
                {/* Feedback Button */}
                <Button
                  onClick={onShowFeedback}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-secondary"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </Button>
              </>
            )}
            
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
