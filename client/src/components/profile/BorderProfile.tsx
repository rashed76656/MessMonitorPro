import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Printer, Save, X } from 'lucide-react';
import { User } from '@/types';
import { updateUserProfile } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

interface BorderProfileProps {
  border: User;
  currentUser: User;
  onPrint: (border: User) => void;
}

export const BorderProfile = ({ border, currentUser, onPrint }: BorderProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(border);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const canEdit = currentUser.role === 'admin';

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile(border.uid, editData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "The profile has been updated successfully.",
      });
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

  const handleCancel = () => {
    setEditData(border);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {getInitials(border.name)}
                </span>
              </div>
              <div>
                <h1 className="font-inter font-bold text-2xl text-gray-900">
                  {border.name}
                </h1>
                <p className="text-gray-600">{border.department}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge className="bg-green-100 text-green-800">Active Border</Badge>
                  <span className="text-gray-500 text-sm">
                    Joined: {border.joinDate || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {canEdit && (
                <>
                  {isEditing ? (
                    <>
                      <Button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="bg-primary hover:bg-blue-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        disabled={loading}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-blue-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </>
              )}
              <Button 
                onClick={() => onPrint(border)}
                className="bg-secondary hover:bg-green-700"
              >
                <Printer className="mr-2 h-4 w-4" />
                Printer Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Full Name</span>
              {isEditing ? (
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-gray-900">{border.name}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone</span>
              {isEditing ? (
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-gray-900">{border.phone}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{border.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department</span>
              {isEditing ? (
                <Input
                  value={editData.department || ''}
                  onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-gray-900">{border.department}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Duty</span>
              {isEditing ? (
                <Input
                  value={editData.duty || ''}
                  onChange={(e) => setEditData({ ...editData, duty: e.target.value })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-gray-900">{border.duty}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Financial Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Owes To</span>
              {isEditing ? (
                <Input
                  value={editData.owesTo || ''}
                  onChange={(e) => setEditData({ ...editData, owesTo: e.target.value })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-red-600">{border.owesTo || 'None'}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gets From</span>
              {isEditing ? (
                <Input
                  value={editData.getsFrom || ''}
                  onChange={(e) => setEditData({ ...editData, getsFrom: e.target.value })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-green-600">{border.getsFrom || 'None'}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Contribution</span>
              {isEditing ? (
                <Input
                  type="number"
                  value={editData.monthlyContribution || ''}
                  onChange={(e) => setEditData({ ...editData, monthlyContribution: Number(e.target.value) })}
                  className="w-48"
                />
              ) : (
                <span className="font-medium text-gray-900">
                  ৳ {border.monthlyContribution?.toLocaleString() || 'Not set'}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Payment</span>
              <span className="font-medium text-gray-900">{border.lastPayment || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fines Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Fines & Penalties</CardTitle>
        </CardHeader>
        <CardContent>
          {!border.fines || border.fines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No fines recorded for this border.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {border.fines.map((fine, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap">{fine.date}</TableCell>
                      <TableCell>{fine.reason}</TableCell>
                      <TableCell className="font-medium">৳ {fine.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={fine.status === 'paid' ? 'default' : 'secondary'}
                          className={fine.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {fine.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
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
