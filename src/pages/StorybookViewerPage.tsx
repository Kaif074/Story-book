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
    // Create a printable version of the storybook
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: 'Error',
        description: 'Please allow pop-ups to download PDF',
        variant: 'destructive'
      });
      return;
    }

    const storyContent = Array.isArray(storybook.story_content) ? storybook.story_content : [];
    
    // Generate HTML for print
    let printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${storybook.child_name}'s Storybook</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
          }
          .page {
            width: 210mm;
            height: 297mm;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            box-sizing: border-box;
          }
          .cover-page {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
          }
          .cover-photo {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 30px;
            border: 5px solid white;
          }
          .cover-title {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .cover-subtitle {
            font-size: 24px;
            opacity: 0.9;
          }
          .story-page {
            background: white;
          }
          .story-image {
            max-width: 100%;
            max-height: 60%;
            object-fit: contain;
            margin-bottom: 30px;
          }
          .story-text {
            font-size: 18px;
            line-height: 1.8;
            text-align: center;
            max-width: 80%;
            color: #333;
          }
          .page-number {
            position: absolute;
            bottom: 20px;
            font-size: 14px;
            color: #666;
          }
          .final-page {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: center;
            padding: 60px;
          }
          .final-photo-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .final-photo {
            width: 280px;
            height: 280px;
            border-radius: 20px;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }
          .final-text-container {
            text-align: left;
          }
          .final-title {
            font-size: 42px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 30px;
          }
          .final-quote {
            font-size: 22px;
            line-height: 1.6;
            font-style: italic;
            color: #333;
            margin-bottom: 25px;
            position: relative;
            padding-left: 20px;
          }
          .final-message {
            font-size: 18px;
            color: #666;
            font-weight: 500;
          }
          .quote-mark {
            font-size: 80px;
            color: rgba(102, 126, 234, 0.2);
            font-family: serif;
            position: absolute;
            left: -20px;
            top: -30px;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="page cover-page">
          ${storybook.photo_url ? `<img src="${storybook.photo_url}" alt="${storybook.child_name}" class="cover-photo" />` : ''}
          <h1 class="cover-title">${storybook.child_name}'s<br/>${storybook.template?.name || 'Story'}</h1>
          <p class="cover-subtitle">A Personalized Story</p>
        </div>
    `;

    // Add story pages
    storyContent.forEach((page, index) => {
      const pageImage = storybook.images?.find(img => img.page_number === index + 1);
      printHTML += `
        <div class="page story-page">
          ${pageImage ? `<img src="${pageImage.image_url}" alt="Page ${index + 1}" class="story-image" />` : ''}
          <p class="story-text">${page.text || ''}</p>
          <div class="page-number">Page ${index + 1}</div>
        </div>
      `;
    });

    // Add final page
    printHTML += `
      <div class="page final-page">
        ${storybook.photo_url ? `
          <div class="final-photo-container">
            <img src="${storybook.photo_url}" alt="${storybook.child_name}" class="final-photo" />
          </div>
        ` : ''}
        <div class="final-text-container">
          <h2 class="final-title">The End</h2>
          <div style="position: relative;">
            <span class="quote-mark">"</span>
            <p class="final-quote">
              And so, ${storybook.child_name}'s incredible adventure came to a close, but the memories and lessons learned will last forever.
            </p>
          </div>
          <p class="final-message">
            Every ending is just a new beginning waiting to unfold. ✨
          </p>
        </div>
      </div>
    `;

    printHTML += `
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for images to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };

    toast({
      title: 'Preparing PDF',
      description: 'Print dialog will open shortly. Select "Save as PDF" as the destination.'
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
            {currentPage === 0 ? (
              <div className="aspect-[4/3] xl:aspect-[16/10] bg-gradient-hero relative">
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
              </div>
            ) : currentPage === totalPages - 1 ? (
              <div className="aspect-[4/3] xl:aspect-[16/10] bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="max-w-4xl w-full grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
                    {storybook.photo_url && (
                      <div className="order-2 xl:order-1 flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                          <div className="relative w-48 h-48 xl:w-64 xl:h-64 rounded-2xl overflow-hidden shadow-elegant border-4 border-background">
                            <img
                              src={storybook.photo_url}
                              alt={storybook.child_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={`order-1 xl:order-2 text-center ${storybook.photo_url ? 'xl:text-left' : ''}`}>
                      <div className="space-y-4">
                        <h2 className="text-2xl xl:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                          The End
                        </h2>
                        <div className="relative">
                          <div className="absolute -left-4 top-0 text-6xl text-primary/20 font-serif">"</div>
                          <p className="text-lg xl:text-xl leading-relaxed text-foreground/90 italic pl-4">
                            And so, {storybook.child_name}'s incredible adventure came to a close, but the memories and lessons learned will last forever.
                          </p>
                          <div className="absolute -right-4 bottom-0 text-6xl text-primary/20 font-serif">"</div>
                        </div>
                        <p className="text-base xl:text-lg text-muted-foreground font-medium pt-4">
                          Every ending is just a new beginning waiting to unfold. ✨
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                {currentImage && (
                  <div className="w-full bg-card">
                    <img
                      src={currentImage.image_url}
                      alt={`Page ${currentPage}`}
                      className="w-full h-auto object-contain max-h-[60vh]"
                    />
                  </div>
                )}
                <div className="bg-gradient-to-b from-card to-card/95 p-8 xl:p-12 border-t-2 border-primary/10">
                  <div className="max-w-3xl mx-auto">
                    <p className="text-xl xl:text-2xl leading-relaxed text-center font-serif text-foreground">
                      {storyContent[currentPage - 1]?.text || 'Story text is being generated...'}
                    </p>
                    {!storyContent[currentPage - 1]?.text && (
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        Page {currentPage} content
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
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
