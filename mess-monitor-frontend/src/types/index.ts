export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'border';
  department?: string;
  duty?: string;
  owesTo?: string;
  getsFrom?: string;
  monthlyContribution?: number;
  lastPayment?: string;
  joinDate?: string;
  fines?: Fine[];
}

export interface Fine {
  id: string;
  date: string;
  reason: string;
  amount: number;
  status: 'pending' | 'paid';
}

export interface FundTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  fromTo: string;
  purpose: string;
  trxId?: string;
  timestamp: any;
}

export interface Config {
  adminKey: string;
}

export interface Statistics {
  totalBorders: number;
  currentBalance: number;
  outstandingDues: number;
  totalFines: number;
  totalIncome: number;
  totalExpense: number;
  newBordersThisMonth: number;
  pendingFeedbacks: number;
  activeAnnouncements: number;
  unreadNotifications: number;
}

export * from './notifications';
