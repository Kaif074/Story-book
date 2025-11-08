import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Loader2, Plus, Trash2 } from 'lucide-react';
import { getUserStorybooks, deleteStorybook } from '@/db/api';
import type { Storybook } from '@/types/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LibraryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storybooks, setStorybooks] = useState<Storybook[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadStorybooks();
  }, []);

  const loadStorybooks = async () => {
    try {
      setLoading(true);
      const data = await getUserStorybooks();
      setStorybooks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load storybooks',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteStorybook(id);
      setStorybooks(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'Deleted',
        description: 'Storybook has been deleted'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete storybook',
        variant: 'destructive'
      });
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-primary/10 text-primary',
      generating: 'bg-secondary/10 text-secondary',
      pending: 'bg-muted text-muted-foreground',
      failed: 'bg-destructive/10 text-destructive'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 xl:py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div>
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl xl:text-4xl font-bold">My Storybook Library</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your personalized storybooks
            </p>
          </div>
          <Link to="/create">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create New Story
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : storybooks.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No storybooks yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first personalized storybook to get started
              </p>
              <Link to="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Story
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {storybooks.map((storybook) => (
              <Card key={storybook.id} className="shadow-card hover:shadow-soft transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">
                      {storybook.child_name}'s Story
                    </CardTitle>
                    {getStatusBadge(storybook.status)}
                  </div>
                  <CardDescription>
                    Age {storybook.child_age} • Created {new Date(storybook.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {storybook.photo_url && (
                    <img
                      src={storybook.photo_url}
                      alt={storybook.child_name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex gap-2">
                    {storybook.status === 'completed' && (
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/storybook/${storybook.id}`)}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Read Story
                      </Button>
                    )}
                    {storybook.status === 'generating' && (
                      <Button className="flex-1" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </Button>
                    )}
                    {storybook.status === 'failed' && (
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => navigate('/create')}
                      >
                        Try Again
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={deleting === storybook.id}
                        >
                          {deleting === storybook.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Storybook?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{storybook.child_name}'s Story". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(storybook.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
