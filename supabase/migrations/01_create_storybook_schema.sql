/*
# Create Storybook Schema

## 1. New Tables

### story_templates
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, not null) - Template name (e.g., "Magical Forest Adventure")
- `description` (text) - Template description
- `theme` (text, not null) - Theme category
- `age_min` (integer, not null) - Minimum recommended age
- `age_max` (integer, not null) - Maximum recommended age
- `story_structure` (jsonb, not null) - Story template structure with placeholders
- `image_prompts` (jsonb, not null) - Array of image generation prompts
- `created_at` (timestamptz, default: now())

### storybooks
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (text, not null) - Anonymous user identifier (UUID stored in localStorage)
- `child_name` (text, not null) - Child's name
- `child_age` (integer, not null) - Child's age
- `child_gender` (text) - Child's gender
- `template_id` (uuid, references story_templates) - Selected template
- `photo_url` (text) - URL to child's photo in storage
- `story_content` (jsonb, not null) - Generated story pages
- `status` (text, default: 'pending') - Generation status: pending, generating, completed, failed
- `created_at` (timestamptz, default: now())
- `completed_at` (timestamptz) - When generation completed

### storybook_images
- `id` (uuid, primary key, default: gen_random_uuid())
- `storybook_id` (uuid, references storybooks, on delete cascade)
- `page_number` (integer, not null) - Page number in the story
- `image_url` (text, not null) - URL to generated image
- `prompt` (text) - Prompt used to generate the image
- `created_at` (timestamptz, default: now())

## 2. Storage Buckets
- Create `app-7fe84onkvoxt_photos` bucket for child photos
- Create `app-7fe84onkvoxt_storybook_images` bucket for generated story images

## 3. Security
- No RLS enabled - public access for all users
- All tables are publicly readable and writable
- Storage buckets are publicly accessible

## 4. Initial Data
- Insert 3 story templates with predefined structures
*/

-- Create story_templates table
CREATE TABLE IF NOT EXISTS story_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  theme text NOT NULL,
  age_min integer NOT NULL,
  age_max integer NOT NULL,
  story_structure jsonb NOT NULL,
  image_prompts jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create storybooks table
CREATE TABLE IF NOT EXISTS storybooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  child_name text NOT NULL,
  child_age integer NOT NULL,
  child_gender text,
  template_id uuid REFERENCES story_templates(id),
  photo_url text,
  story_content jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create storybook_images table
CREATE TABLE IF NOT EXISTS storybook_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storybook_id uuid REFERENCES storybooks(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  image_url text NOT NULL,
  prompt text,
  created_at timestamptz DEFAULT now()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('app-7fe84onkvoxt_photos', 'app-7fe84onkvoxt_photos', true),
  ('app-7fe84onkvoxt_storybook_images', 'app-7fe84onkvoxt_storybook_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access
CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id IN ('app-7fe84onkvoxt_photos', 'app-7fe84onkvoxt_storybook_images'));

-- Insert story templates
INSERT INTO story_templates (name, description, theme, age_min, age_max, story_structure, image_prompts) VALUES
(
  'Magical Forest Adventure',
  'A journey through an enchanted forest where the child discovers magical creatures and learns about friendship.',
  'Fantasy',
  3,
  7,
  '[
    {"page": 1, "text": "Once upon a time, there was a brave child named {child_name} who loved exploring."},
    {"page": 2, "text": "One sunny day, {child_name} discovered a magical forest filled with sparkling trees."},
    {"page": 3, "text": "In the forest, {child_name} met a friendly unicorn with a shimmering rainbow mane."},
    {"page": 4, "text": "The unicorn took {child_name} on an amazing adventure through the clouds."},
    {"page": 5, "text": "Together, they helped a lost baby dragon find its way home."},
    {"page": 6, "text": "{child_name} learned that kindness and bravery can make the world magical!"}
  ]'::jsonb,
  '[
    "A magical forest entrance with sparkling trees and glowing flowers, children''s book illustration style, bright and colorful",
    "A friendly white unicorn with rainbow mane in an enchanted forest, children''s book illustration, whimsical and magical",
    "Flying through fluffy white clouds on a magical adventure, children''s book illustration, dreamy and colorful",
    "A cute baby dragon with big eyes in a cozy cave, children''s book illustration, warm and friendly",
    "A happy celebration scene in a magical forest with forest creatures, children''s book illustration, joyful and bright",
    "A heartwarming scene showing friendship and kindness, children''s book illustration, colorful and uplifting"
  ]'::jsonb
),
(
  'Space Explorer Mission',
  'An exciting journey through space where the child becomes an astronaut and explores distant planets.',
  'Science Fiction',
  4,
  8,
  '[
    {"page": 1, "text": "Meet {child_name}, a curious explorer who dreamed of visiting the stars."},
    {"page": 2, "text": "One night, {child_name} found a special spaceship in the backyard!"},
    {"page": 3, "text": "{child_name} blasted off into space, zooming past colorful planets and twinkling stars."},
    {"page": 4, "text": "On a purple planet, {child_name} met friendly aliens who loved to dance."},
    {"page": 5, "text": "The aliens showed {child_name} their amazing crystal gardens."},
    {"page": 6, "text": "{child_name} returned home with wonderful memories and new friends across the galaxy!"}
  ]'::jsonb,
  '[
    "A shiny colorful spaceship in a backyard at night with stars above, children''s book illustration, exciting and magical",
    "A spaceship flying through space with colorful planets and stars, children''s book illustration, vibrant and cosmic",
    "A purple alien planet with friendly cute aliens, children''s book illustration, fun and whimsical",
    "Friendly aliens dancing and celebrating, children''s book illustration, joyful and colorful",
    "Beautiful crystal gardens on an alien planet with glowing crystals, children''s book illustration, magical and sparkly",
    "A spaceship returning to Earth with a starry sky, children''s book illustration, peaceful and beautiful"
  ]'::jsonb
),
(
  'Pirate Treasure Hunt',
  'A swashbuckling adventure on the high seas where the child becomes a brave pirate captain.',
  'Adventure',
  4,
  8,
  '[
    {"page": 1, "text": "Ahoy! This is the story of Captain {child_name}, the bravest pirate on the seven seas!"},
    {"page": 2, "text": "Captain {child_name} found an old treasure map hidden in a bottle."},
    {"page": 3, "text": "With a loyal crew, {child_name} sailed across the sparkling blue ocean."},
    {"page": 4, "text": "They discovered a mysterious island with palm trees and sandy beaches."},
    {"page": 5, "text": "Following the map, {child_name} found a treasure chest filled with golden coins and jewels!"},
    {"page": 6, "text": "Captain {child_name} shared the treasure with everyone, proving that sharing makes adventures even better!"}
  ]'::jsonb,
  '[
    "An old treasure map with an X marking the spot, children''s book illustration, mysterious and exciting",
    "A friendly pirate ship with colorful sails on the ocean, children''s book illustration, adventurous and fun",
    "A pirate ship sailing on sparkling blue ocean with dolphins, children''s book illustration, bright and cheerful",
    "A tropical island with palm trees and sandy beach, children''s book illustration, sunny and inviting",
    "An open treasure chest filled with gold coins and colorful jewels, children''s book illustration, sparkly and exciting",
    "A celebration scene with pirates sharing treasure, children''s book illustration, joyful and heartwarming"
  ]'::jsonb
);
