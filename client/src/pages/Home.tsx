import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { BorderProfile } from '@/components/profile/BorderProfile';
import { PrintableReceipt } from '@/components/profile/PrintableReceipt';
import { FundModal } from '@/components/modals/FundModal';
import { AnnouncementModal } from '@/components/modals/AnnouncementModal';
import { FeedbackModal } from '@/components/modals/FeedbackModal';
import { ViewFeedbackModal } from '@/components/modals/ViewFeedbackModal';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { User, FundTransaction, Announcement, Feedback } from '@/types';

export default function Home() {
  const { user, userProfile, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedBorder, setSelectedBorder] = useState<User | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printBorder, setPrintBorder] = useState<User | null>(null);
  const [showFundModal, setShowFundModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState<FundTransaction | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewFeedback, setViewFeedback] = useState<Feedback | null>(null);

  const handleViewProfile = (border: User) => {
    setSelectedBorder(border);
  };

  const handlePrintProfile = (border: User) => {
    setPrintBorder(border);
    setShowPrintModal(true);
  };

  const handleAddTransaction = () => {
    setEditTransaction(null);
    setShowFundModal(true);
  };

  const handleEditTransaction = (transaction: FundTransaction) => {
    setEditTransaction(transaction);
    setShowFundModal(true);
  };

  const handleCloseFundModal = () => {
    setShowFundModal(false);
    setEditTransaction(null);
  };

  const handleAddAnnouncement = () => {
    setEditAnnouncement(null);
    setShowAnnouncementModal(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  const handleCloseAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setEditAnnouncement(null);
  };

  const handleShowFeedback = () => {
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  const handleShowNotifications = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleViewFeedback = (feedback: Feedback) => {
    setViewFeedback(feedback);
  };

  const handleCloseViewFeedback = () => {
    setViewFeedback(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login/register forms
  if (!user || !userProfile) {
    if (showRegister) {
      return (
        <RegisterForm onShowLogin={() => setShowRegister(false)} />
      );
    }
    return (
      <LoginForm onShowRegister={() => setShowRegister(true)} />
    );
  }

  // Authenticated - show appropriate interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        userProfile={userProfile}
        onShowNotifications={handleShowNotifications}
        onShowFeedback={handleShowFeedback}
      />
      
      {/* Show border profile if selected, otherwise show appropriate dashboard */}
      {selectedBorder ? (
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setSelectedBorder(null)}
              className="text-primary hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
          <BorderProfile 
            border={selectedBorder}
            currentUser={userProfile}
            onPrint={handlePrintProfile}
          />
        </div>
      ) : userProfile.role === 'admin' ? (
        <AdminDashboard
          userProfile={userProfile}
          onViewProfile={handleViewProfile}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
          onAddAnnouncement={handleAddAnnouncement}
          onEditAnnouncement={handleEditAnnouncement}
          onViewFeedback={handleViewFeedback}
        />
      ) : (
        <BorderProfile 
          border={userProfile}
          currentUser={userProfile}
          onPrint={handlePrintProfile}
        />
      )}

      {/* Modals */}
      {showPrintModal && printBorder && (
        <PrintableReceipt
          border={printBorder}
          onClose={() => {
            setShowPrintModal(false);
            setPrintBorder(null);
          }}
        />
      )}

      <FundModal
        isOpen={showFundModal}
        onClose={handleCloseFundModal}
        transaction={editTransaction}
      />

      {/* Announcement Modal for Admin */}
      {userProfile.role === 'admin' && (
        <AnnouncementModal
          isOpen={showAnnouncementModal}
          onClose={handleCloseAnnouncementModal}
          createdBy={userProfile.uid}
          createdByName={userProfile.name}
        />
      )}

      {/* Feedback Modal for Borders */}
      {userProfile.role === 'border' && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={handleCloseFeedbackModal}
          borderUid={userProfile.uid}
          borderName={userProfile.name}
        />
      )}

      {/* Notification Panel for Borders */}
      {userProfile.role === 'border' && (
        <NotificationPanel
          borderUid={userProfile.uid}
          isOpen={showNotifications}
          onClose={handleCloseNotifications}
        />
      )}

      {/* View Feedback Modal for Admin */}
      {userProfile.role === 'admin' && (
        <ViewFeedbackModal
          feedback={viewFeedback}
          isOpen={!!viewFeedback}
          onClose={handleCloseViewFeedback}
        />
      )}
    </div>
  );
}
