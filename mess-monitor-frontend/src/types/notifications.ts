export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'alert';
  createdAt: string;
  createdBy: string;
  isRead: boolean;
  timestamp: any;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: any;
}

export interface Feedback {
  id: string;
  borderUid: string;
  borderName: string;
  subject: string;
  message: string;
  rating: number;
  category: 'food' | 'service' | 'management' | 'facilities' | 'other';
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  adminResponse?: string;
  respondedAt?: string;
  timestamp: any;
}