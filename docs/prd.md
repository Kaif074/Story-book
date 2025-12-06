# Kids' Storybook with Kids' Faces Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
Kids' Storybook with Kids' Faces\n
### 1.2 Application Description
A personalized storybook generation platform that allows users to upload a child's photo and automatically creates customized storybooks featuring that child as the main character, using story templates and AI-generated illustrations.

### 1.3 Core Purpose
Provide parents with an innovative way to create personalized, engaging storybooks that feature their children as protagonists, fostering reading interest and creating memorable keepsakes.

## 2. Credit System

### 2.1 Free Credits
- Each new user receives 100 free credits upon registration
- Credits are used to generate storybook pages\n- Each page generation costs 15 credits
- Free credits allow users to create approximately 6-7 pages (one complete storybook)

### 2.2 Credit Management
- Credit balance display and tracking
- Real-time credit balance updates
- Credit usage notifications
\n## 3. Main Features

### 3.1 Input Collection System
- Child information form (name, age, gender)\n- Photo upload functionality for face integration
- Story template selection (Magical Forest, Space Explorer, Pirate Adventure, etc.)
- User-friendly interface for data collection

### 3.2 Story Generation Engine
- AI-powered story creation using predefined templates
- Age-appropriate content adjustment based on child's age
- Personalized narrative with child's name integration
- Multiple story themes and templates library

### 3.3 Image Generation and Face Integration
- AI-generated illustrations for each story page
- Face swap technology to insert child's face into illustrations
- Consistent art style maintenance across all images
- High-quality, colorful, child-friendly artwork

### 3.4 Storybook Assembly
- Automatic combination of story text and personalized images
- HTML and PDF format generation
- Title page creation with child's name
- Professional layout and formatting

### 3.5 Final Page Text and Photo Integration
- **Core Objective**: Create a harmonious final page where text complements the photograph to deliver a powerful story ending
- **Text Requirements**:
  - Tone matches the story's overall mood (reflective, hopeful, conclusive, bittersweet)
  - Concise, evocative prose (1-3 short sentences or small paragraph)
  - Text enhances the photograph's emotional impact rather than merely describing it
  - Uses the image as a launching point for the final thought, emotion, or message
- **Layout & Typography**:
  - Optimal text placement (overlayed on less busy image areas, or positioned in margins)
  - Readable font selection reflecting story genre (serif for classic, sans-serif for modern)
  - Sufficient color contrast against photo background
  - Optional semi-transparent background panel behind text for readability
- **Visual Harmony**:
  - Balanced composition where text and image form a cohesive unit
  - Text avoids covering crucial photograph elements
  - Elegant, intentional, and satisfying overall effect

### 3.6 Delivery and Output
- Email delivery system for completed storybooks
- Download link generation\n- Web-based storybook viewing option
- Analytics and usage tracking

## 4. Technical Workflow

### 4.1 Workflow Architecture
```
Credit Check → Form Trigger → Story Variables Setup → AI Story Generator → \nImage Generation Loop → Final Page Text-Photo Integration → Credit Deduction → 
HTML Assembly → PDF Conversion → Delivery System
```

### 4.2 Core Components
- n8n workflow automation\n- OpenAI/GPT API integration for story generation
- DALL·E/Stability AI for image generation
- Face swap APIs (InsightFace, BriAR, Reface)
- Text overlay and typography engine for final page composition
- HTML to PDF conversion tools
- Email delivery system
- Credit management system

### 4.3 Story Template Structure
- 6-page story format
- Title page with personalized name
- Sequential narrative pages with illustrations
- Final page with integrated text and photograph
- Age-appropriate vocabulary and themes
- Positive messaging focusing on kindness and bravery

## 5. User Management System

### 5.1 Account Features
- User registration and login system
- Credit balance tracking and display
- Story generation history\n- Personal dashboard for managing creations
\n### 5.2 Credit Tracking
- Real-time credit balance updates
- Credit usage notifications
- Credit usage history
\n## 6. Future Enhancement Features

### 6.1 Advanced Features
- Voice-over reading with AI narrator
- Multiple character integration (friends/family faces)
- Various art style options (comic, watercolor, fairytale)
- Social sharing capabilities
\n### 6.2 Enhanced User Management
- Save and favorite stories functionality
- Previous creations library
- Family account management
\n## 7. Design Style\n
### 7.1 Color Scheme
- Primary colors: Warm pastels (soft blues, gentle pinks, sunny yellows)
- Accent colors: Vibrant but child-friendly tones\n- Background: Clean whites with subtle gradients

### 7.2 Visual Elements
- Rounded corners for all interface elements
- Soft drop shadows for depth
- Playful, child-friendly icons
- Smooth transitions and animations
- Credit counter with engaging visual indicators

### 7.3 Layout Design
- Card-based layout for story templates
- Step-by-step wizard interface for story creation
- Clean, intuitive navigation
- Mobile-responsive design for accessibility
- Prominent credit balance display

## 8. Uploaded Images
- image.png (provided twice for reference)