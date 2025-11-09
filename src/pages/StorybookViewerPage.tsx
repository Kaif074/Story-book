import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { getStorybookById } from '@/db/api';
import type { StorybookWithDetails } from '@/types/types';

export default function StorybookViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storybook, setStorybook] = useState<StorybookWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (id) {
      loadStorybook(id);
    }
  }, [id]);

  const loadStorybook = async (storybookId: string) => {
    try {
      setLoading(true);
      const data = await getStorybookById(storybookId);
      if (!data) {
        toast({
          title: 'Not found',
          description: 'Storybook not found',
          variant: 'destructive'
        });
        navigate('/library');
        return;
      }
      console.log('Loaded storybook:', data);
      console.log('Story content:', data.story_content);
      setStorybook(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load storybook',
        variant: 'destructive'
      });
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (storybook && currentPage < storybook.story_content.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleDownloadPDF = () => {
    toast({
      title: 'Coming Soon',
      description: 'PDF download feature will be available soon'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!storybook) {
    return null;
  }

  const storyContent = Array.isArray(storybook.story_content) ? storybook.story_content : [];
  const totalPages = storyContent.length + 1;
  const currentImage = storybook.images?.find(img => img.page_number === currentPage);

  return (
    <div className="min-h-screen py-8 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/library')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="shadow-card overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-[4/3] xl:aspect-[16/10] bg-gradient-hero relative">
              {currentPage === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  {storybook.photo_url && (
                    <div className="w-32 h-32 xl:w-48 xl:h-48 rounded-full overflow-hidden mb-6 border-4 border-white shadow-soft">
                      <img
                        src={storybook.photo_url}
                        alt={storybook.child_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-3xl xl:text-5xl font-bold mb-4">
                    {storybook.child_name}'s
                    <br />
                    {storybook.template?.name}
                  </h1>
                  <p className="text-lg xl:text-xl text-muted-foreground">
                    A Personalized Story
                  </p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col">
                  {currentImage && (
                    <div className="flex-1 bg-card">
                      <img
                        src={currentImage.image_url}
                        alt={`Page ${currentPage}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="bg-card p-6 xl:p-8 border-t">
                    <p className="text-base xl:text-lg leading-relaxed text-center max-w-3xl mx-auto">
                      {storyContent[currentPage - 1]?.text || 'Story text is being generated...'}
                    </p>
                    {!storyContent[currentPage - 1]?.text && (
                      <p className="text-sm text-muted-foreground text-center mt-2">
                        Page {currentPage} content
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={prevPage}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </p>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentPage ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
          >
            Next
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {currentPage === totalPages - 1 && (
          <div className="mt-8 text-center">
            <Card className="inline-block">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">The End</h3>
                <p className="text-muted-foreground mb-4">
                  We hope you enjoyed this story!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setCurrentPage(0)} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Read Again
                  </Button>
                  <Button onClick={() => navigate('/create')}>
                    Create Another Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
