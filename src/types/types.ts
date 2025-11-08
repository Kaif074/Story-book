export interface StoryTemplate {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  age_min: number;
  age_max: number;
  story_structure: StoryPage[];
  image_prompts: string[];
  created_at: string;
}

export interface StoryPage {
  page: number;
  text: string;
}

export interface Storybook {
  id: string;
  user_id: string;
  child_name: string;
  child_age: number;
  child_gender: string | null;
  template_id: string | null;
  photo_url: string | null;
  story_content: StoryPage[];
  status: 'pending' | 'generating' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
}

export interface StorybookImage {
  id: string;
  storybook_id: string;
  page_number: number;
  image_url: string;
  prompt: string | null;
  created_at: string;
}

export interface StorybookWithDetails extends Storybook {
  template?: StoryTemplate;
  images?: StorybookImage[];
}

export interface CreateStorybookRequest {
  child_name: string;
  child_age: number;
  child_gender?: string;
  template_id: string;
  photo?: File;
}
