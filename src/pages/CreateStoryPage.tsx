import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Loader2, Upload, X, Sparkles } from 'lucide-react';
import { getStoryTemplates, createStorybook, uploadPhoto, updateStorybook, createStorybookImage, getUserId } from '@/db/api';
import { generateStoryText, generateStoryImage, uploadBase64Image, generateCustomStory, analyzeChildPhoto } from '@/services/ai-service';
import type { StoryTemplate, StoryPage } from '@/types/types';
import { Progress } from '@/components/ui/progress';

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<StoryTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: '',
    templateId: '',
    customStoryIdea: '',
    useCustomStory: false,
    photo: null as File | null,
    photoPreview: ''
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    const templateName = searchParams.get('template');
    if (templateName && templates.length > 0) {
      const template = templates.find(t => t.name === templateName);
      if (template) {
        setFormData(prev => ({
          ...prev,
          templateId: template.id,
          useCustomStory: false
        }));
      }
    }
  }, [searchParams, templates]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getStoryTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load story templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 1MB',
          variant: 'destructive'
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const removePhoto = () => {
    if (formData.photoPreview) {
      URL.revokeObjectURL(formData.photoPreview);
    }
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: ''
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.childName.trim()) {
        toast({
          title: 'Name required',
          description: 'Please enter your child\'s name',
          variant: 'destructive'
        });
        return false;
      }
      const age = Number.parseInt(formData.childAge);
      if (!age || age < 1 || age > 12) {
        toast({
          title: 'Invalid age',
          description: 'Please enter an age between 1 and 12',
          variant: 'destructive'
        });
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.useCustomStory && !formData.templateId) {
        toast({
          title: 'Selection required',
          description: 'Please select a story template or create a custom story',
          variant: 'destructive'
        });
        return false;
      }
      if (formData.useCustomStory && !formData.customStoryIdea.trim()) {
        toast({
          title: 'Story idea required',
          description: 'Please describe your custom story idea',
          variant: 'destructive'
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const generateStorybook = async () => {
    if (!validateStep(2)) return;

    try {
      setGenerating(true);
      setProgress(0);
      setProgressMessage('Creating your storybook...');

      setProgress(10);
      setProgressMessage('Uploading photo...');

      const storybook = await createStorybook({
        user_id: getUserId(),
        child_name: formData.childName,
        child_age: Number.parseInt(formData.childAge),
        child_gender: formData.childGender || null,
        template_id: formData.useCustomStory ? null : formData.templateId,
        status: 'generating'
      });

      let photoUrl = null;
      let childDescription = '';
      
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo, storybook.id);
        await updateStorybook(storybook.id, { photo_url: photoUrl });
        
        // Analyze the photo to extract child's physical characteristics
        setProgressMessage('Analyzing photo to match character appearance...');
        childDescription = await analyzeChildPhoto(photoUrl);
        console.log('Using child description for images:', childDescription);
      }

      setProgress(20);
      setProgressMessage('Generating story pages...');

      let storyPages: StoryPage[] = [];
      let imagePrompts: string[] = [];

      if (formData.useCustomStory) {
        const customStoryResult = await generateCustomStory(
          formData.childName,
          Number.parseInt(formData.childAge),
          formData.customStoryIdea
        );
        storyPages = customStoryResult.pages;
        imagePrompts = customStoryResult.imagePrompts;
      } else {
        const template = templates.find(t => t.id === formData.templateId);
        if (!template) throw new Error('Template not found');

        const totalPages = template.story_structure.length;

        for (let i = 0; i < totalPages; i++) {
          const page = template.story_structure[i];
          setProgressMessage(`Writing page ${i + 1} of ${totalPages}...`);
          
          console.log(`Generating text for page ${i + 1}, template text:`, page.text);
          const enhancedText = await generateStoryText(
            formData.childName,
            Number.parseInt(formData.childAge),
            page.text
          );
          console.log(`Generated text for page ${i + 1}:`, enhancedText);
          
          storyPages.push({
            page: page.page,
            text: enhancedText
          });

          setProgress(20 + (i + 1) * (30 / totalPages));
        }

        imagePrompts = template.image_prompts;
      }

      console.log('Final story pages before saving:', storyPages);
      await updateStorybook(storybook.id, { story_content: storyPages });

      setProgress(50);
      setProgressMessage('Creating beautiful illustrations...');

      for (let i = 0; i < imagePrompts.length; i++) {
        const prompt = imagePrompts[i];
        setProgressMessage(`Generating illustration ${i + 1} of ${imagePrompts.length}...`);
        
        try {
          const base64Image = await generateStoryImage(prompt, childDescription);
          const imageUrl = await uploadBase64Image(base64Image, storybook.id, i + 1);
          
          await createStorybookImage({
            storybook_id: storybook.id,
            page_number: i + 1,
            image_url: imageUrl,
            prompt: prompt
          });

          setProgress(50 + (i + 1) * (45 / imagePrompts.length));
        } catch (error) {
          console.error(`Failed to generate image for page ${i + 1}:`, error);
        }
      }

      setProgress(95);
      setProgressMessage('Finalizing your storybook...');

      await updateStorybook(storybook.id, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      setProgress(100);
      setProgressMessage('Complete!');

      toast({
        title: 'Success!',
        description: 'Your storybook has been created'
      });

      setTimeout(() => {
        navigate(`/storybook/${storybook.id}`);
      }, 1000);

    } catch (error) {
      console.error('Error generating storybook:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate storybook',
        variant: 'destructive'
      });
      setGenerating(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === formData.templateId);

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Creating Your Storybook</CardTitle>
            <CardDescription className="text-center">
              This may take a few minutes...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{progressMessage}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 xl:py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 xl:w-32 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {step} of 3
          </p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell Us About Your Child</CardTitle>
              <CardDescription>
                We'll personalize the story with their name and age
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="childName">Child's Name *</Label>
                <Input
                  id="childName"
                  placeholder="Enter name"
                  value={formData.childName}
                  onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="childAge">Child's Age *</Label>
                <Input
                  id="childAge"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Enter age"
                  value={formData.childAge}
                  onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="childGender">Gender (Optional)</Label>
                <Select
                  value={formData.childGender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, childGender: value }))}
                >
                  <SelectTrigger id="childGender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">Boy</SelectItem>
                    <SelectItem value="girl">Girl</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Child's Photo (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a photo to include on the title page (max 1MB)
                </p>
                {formData.photoPreview ? (
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removePhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <Label htmlFor="photo" className="cursor-pointer">
                      <span className="text-primary hover:underline">Click to upload</span>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </Label>
                  </div>
                )}
              </div>

              <Button onClick={nextStep} className="w-full" size="lg">
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose a Story Template</CardTitle>
              <CardDescription>
                Select an adventure for {formData.childName} or create your own custom story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card
                className={`cursor-pointer transition-all ${
                  formData.useCustomStory
                    ? 'border-primary border-2 shadow-soft'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, useCustomStory: true, templateId: '' }))}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle>Create Custom Story</CardTitle>
                  </div>
                  <CardDescription>
                    Describe your own story idea and let AI create a unique adventure
                  </CardDescription>
                </CardHeader>
                {formData.useCustomStory && (
                  <CardContent>
                    <Textarea
                      placeholder="Example: A story about a brave child who discovers a magical garden where plants can talk and they help save the garden from a drought..."
                      value={formData.customStoryIdea}
                      onChange={(e) => setFormData(prev => ({ ...prev, customStoryIdea: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                )}
              </Card>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        formData.templateId === template.id && !formData.useCustomStory
                          ? 'border-primary border-2 shadow-soft'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, templateId: template.id, useCustomStory: false }))}
                    >
                      <CardHeader>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>Ages {template.age_min}-{template.age_max}</span>
                          <span>•</span>
                          <span>{template.theme}</span>
                          <span>•</span>
                          <span>{template.story_structure.length} pages</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={prevStep} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={nextStep} 
                  className="flex-1" 
                  disabled={!formData.useCustomStory && !formData.templateId}
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Create</CardTitle>
              <CardDescription>
                Check the details before creating your storybook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Child's Name</Label>
                  <p className="text-lg font-medium">{formData.childName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="text-lg font-medium">{formData.childAge} years old</p>
                </div>
                {formData.childGender && (
                  <div>
                    <Label className="text-muted-foreground">Gender</Label>
                    <p className="text-lg font-medium capitalize">{formData.childGender}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Story Template</Label>
                  {formData.useCustomStory ? (
                    <div>
                      <p className="text-lg font-medium mb-2">Custom Story</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {formData.customStoryIdea}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-medium">{selectedTemplate?.name}</p>
                  )}
                </div>
                {formData.photoPreview && (
                  <div>
                    <Label className="text-muted-foreground">Photo</Label>
                    <img
                      src={formData.photoPreview}
                      alt="Child"
                      className="w-32 h-32 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  ⏱️ Story generation typically takes 2-5 minutes. We'll create a personalized story with beautiful AI-generated illustrations.
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={prevStep} variant="outline" className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={generateStorybook} className="flex-1">
                  Create Storybook
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
