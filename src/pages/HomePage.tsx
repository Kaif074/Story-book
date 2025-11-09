import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Image, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <p className="text-sm font-medium">A.SUDHAKAR TEACHER ZPHS THADOOR</p>
      </div>
      
      <section className="gradient-hero py-20 xl:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/fa602594-a6b1-41f6-b8a3-7920a448ebf4.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="text-4xl xl:text-6xl font-bold mb-6 text-foreground">
            Create Magical Storybooks
            <br />
            <span className="text-primary">Starring Your Child</span>
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your child into the hero of their own personalized adventure story with AI-generated illustrations
          </p>
          <Link to="/create">
            <Button size="lg" className="text-lg px-8 py-6 shadow-soft">
              <Sparkles className="mr-2 h-5 w-5" />
              Create Your Storybook
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 xl:py-24 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl xl:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <Card className="shadow-card border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Choose a Story</CardTitle>
                <CardDescription>
                  Select from magical adventures or create your own custom story idea
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-2 hover:border-secondary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Image className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>2. Upload Photo</CardTitle>
                <CardDescription>
                  Add your child's photo and enter their name and age
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-2 hover:border-accent transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <CardTitle>3. AI Magic</CardTitle>
                <CardDescription>
                  Our AI creates a personalized story with beautiful illustrations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>4. Enjoy & Share</CardTitle>
                <CardDescription>
                  Read online or download as PDF to share with family
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 xl:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl xl:text-4xl font-bold text-center mb-4">
            Story Templates
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our collection of engaging story adventures designed for different age groups
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="shadow-card overflow-hidden hover:shadow-soft transition-shadow">
              <div className="h-48 gradient-primary relative">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/f408fffa-1f8b-4f7d-90b5-862ed0a3ad93.jpg"
                  alt="Magical Forest"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <CardHeader>
                <CardTitle>Magical Forest Adventure</CardTitle>
                <CardDescription>
                  Journey through enchanted forests with unicorns and dragons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ages 3-7 • Fantasy</p>
              </CardContent>
            </Card>

            <Card className="shadow-card overflow-hidden hover:shadow-soft transition-shadow">
              <div className="h-48 gradient-secondary relative">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/7b1c7dd4-098d-4bfb-9124-5b09be9c7650.jpg"
                  alt="Space Explorer"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <CardHeader>
                <CardTitle>Space Explorer Mission</CardTitle>
                <CardDescription>
                  Blast off to distant planets and meet friendly aliens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ages 4-8 • Science Fiction</p>
              </CardContent>
            </Card>

            <Card className="shadow-card overflow-hidden hover:shadow-soft transition-shadow">
              <div className="h-48 bg-accent relative">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/fa602594-a6b1-41f6-b8a3-7920a448ebf4.jpg"
                  alt="Pirate Adventure"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <CardHeader>
                <CardTitle>Pirate Treasure Hunt</CardTitle>
                <CardDescription>
                  Sail the seven seas in search of hidden treasure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ages 4-8 • Adventure</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 xl:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 xl:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft border-4 border-background">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/f408fffa-1f8b-4f7d-90b5-862ed0a3ad93.jpg"
                  alt="Character Matching Technology"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-soft">
                <p className="text-sm font-medium">AI Character Matching</p>
              </div>
            </div>
            <div className="order-1 xl:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Advanced AI Technology</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Characters That Look Like Your Child
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our advanced AI analyzes your child's photo to create story characters that match their unique appearance - from hair color and eye color to distinctive features.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Smart Photo Analysis</p>
                    <p className="text-sm text-muted-foreground">AI identifies physical characteristics like hair color, eye color, and skin tone</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Personalized Characters</p>
                    <p className="text-sm text-muted-foreground">Story illustrations feature characters that resemble your child</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Consistent Appearance</p>
                    <p className="text-sm text-muted-foreground">Characters maintain the same look throughout the entire story</p>
                  </div>
                </li>
              </ul>
              <Link to="/create">
                <Button size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 xl:py-24 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">New Feature</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">
                Create Your Own Custom Story
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Have a unique story idea? Our AI can bring it to life! Simply describe your story concept, and we'll create a personalized adventure featuring your child as the hero.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Unlimited Creativity</p>
                    <p className="text-sm text-muted-foreground">Any theme, any adventure - from magical gardens to underwater kingdoms</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">AI-Powered Writing</p>
                    <p className="text-sm text-muted-foreground">Professional storytelling tailored to your child's age</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Beautiful Illustrations</p>
                    <p className="text-sm text-muted-foreground">Custom AI-generated artwork for every page</p>
                  </div>
                </li>
              </ul>
              <Link to="/create">
                <Button size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-soft border-4 border-background">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/f408fffa-1f8b-4f7d-90b5-862ed0a3ad93.jpg"
                  alt="Custom Story Creation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-soft">
                <p className="text-sm font-medium">Your Story, Your Way!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 xl:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl xl:text-4xl font-bold mb-6">
            Ready to Create Magic?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start creating personalized storybooks that your child will treasure forever
          </p>
          <div className="flex flex-col xl:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="w-full xl:w-auto">
                Create Storybook
              </Button>
            </Link>
            <Link to="/library">
              <Button size="lg" variant="outline" className="w-full xl:w-auto">
                View My Library
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>2025 Kids' Storybook</p>
        </div>
      </footer>
    </div>
  );
}
