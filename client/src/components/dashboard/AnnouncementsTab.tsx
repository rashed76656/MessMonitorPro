import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Megaphone, AlertTriangle, Info } from 'lucide-react';
import { Announcement } from '@/types';
import { listenToAnnouncements, deleteAnnouncement } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

interface AnnouncementsTabProps {
  onAddAnnouncement: () => void;
  onEditAnnouncement: (announcement: Announcement) => void;
}

export const AnnouncementsTab = ({ onAddAnnouncement, onEditAnnouncement }: AnnouncementsTabProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenToAnnouncements((announcementsData) => {
      setAnnouncements(announcementsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteAnnouncement = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        toast({
          title: "Announcement deleted",
          description: "The announcement has been removed successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading announcements...</div>;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-inter font-semibold text-xl text-gray-900">Announcements Management</h3>
        <Button onClick={onAddAnnouncement} className="bg-secondary hover:bg-green-700 whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Megaphone className="text-primary text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card>
        <CardContent className="p-0">
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No announcements found. Create your first announcement above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Title</TableHead>
                    <TableHead className="min-w-[100px]">Priority</TableHead>
                    <TableHead className="min-w-[120px]">Created By</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[200px]">Content Preview</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getPriorityIcon(announcement.priority)}
                          <span className="ml-2">{announcement.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{announcement.createdByName}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {announcement.createdAt}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {announcement.content}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditAnnouncement(announcement)}
                            className="text-primary hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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