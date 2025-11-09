const APP_ID = import.meta.env.VITE_APP_ID;

interface LLMResponse {
  candidates: Array<{
    content: {
      role: string;
      parts: Array<{ text: string }>;
    };
    finishReason: string;
  }>;
}

interface ImageGenerationResponse {
  candidates: Array<{
    content: {
      role: string;
      parts: Array<{ text: string }>;
    };
    finishReason: string;
  }>;
}

export const generateStoryText = async (
  childName: string,
  childAge: number,
  templateText: string
): Promise<string> => {
  const prompt = `You are a children's story writer. Enhance the following story template by making it more engaging and age-appropriate for a ${childAge}-year-old child. Replace {child_name} with "${childName}" throughout the story. Keep the same structure but make the language more vivid and exciting. Return ONLY the enhanced story text without any additional commentary.

Template: ${templateText}`;

  try {
    const response = await fetch(
      'https://api-integrations.appmedo.com/app-7fe84onkvoxt/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      console.error('Story generation API error:', response.status);
      return templateText.replace(/{child_name}/g, childName);
    }

    const text = await response.text();
    
    const lines = text.split('\n').filter(line => line.trim().startsWith('data:'));
    let fullText = '';
    
    for (const line of lines) {
      try {
        const jsonStr = line.replace(/^data:\s*/, '');
        if (jsonStr.trim() === '[DONE]') continue;
        
        const data = JSON.parse(jsonStr);
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          fullText += content;
        }
      } catch (e) {
        console.error('Error parsing SSE line:', e);
      }
    }
    
    return fullText || templateText.replace(/{child_name}/g, childName);
  } catch (error) {
    console.error('Story generation error:', error);
    return templateText.replace(/{child_name}/g, childName);
  }
};

export const generateStoryImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      'https://api-integrations.appmedo.com/app-7fe84onkvoxt/api-zYm4KXvJM6eL/v1beta/models/gemini-2.5-flash-image-preview:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image generation API error:', response.status, errorText);
      throw new Error(`Failed to generate image: ${response.status}`);
    }

    const data: ImageGenerationResponse = await response.json();
    const markdownText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const imageMatch = markdownText.match(/!\[.*?\]\((data:image\/[^)]+)\)/);
    if (imageMatch && imageMatch[1]) {
      return imageMatch[1];
    }
    
    throw new Error('No image data found in response');
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};

export const uploadBase64Image = async (
  base64Data: string,
  storybookId: string,
  pageNumber: number
): Promise<string> => {
  const base64Match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error('Invalid base64 image data');
  }

  const [, format, data] = base64Match;
  const blob = await fetch(base64Data).then(res => res.blob());
  
  const fileName = `${storybookId}_page_${pageNumber}.${format}`;
  
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const { error: uploadError } = await supabase.storage
    .from('app-7fe84onkvoxt_storybook_images')
    .upload(fileName, blob, {
      contentType: `image/${format}`,
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('app-7fe84onkvoxt_storybook_images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

export const generateCustomStory = async (
  childName: string,
  childAge: number,
  storyIdea: string
): Promise<{ pages: Array<{ page: number; text: string }>; imagePrompts: string[] }> => {
  const prompt = `You are a children's story writer. Create a personalized storybook for a ${childAge}-year-old child named ${childName} based on this idea: "${storyIdea}"

Requirements:
1. Create exactly 6 pages of story content
2. Each page should have 2-3 sentences appropriate for a ${childAge}-year-old
3. Use ${childName} as the main character throughout
4. Include themes of kindness, bravery, and friendship
5. End with a positive, uplifting conclusion

Return your response in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "pages": [
    {"page": 1, "text": "Page 1 story text here..."},
    {"page": 2, "text": "Page 2 story text here..."},
    {"page": 3, "text": "Page 3 story text here..."},
    {"page": 4, "text": "Page 4 story text here..."},
    {"page": 5, "text": "Page 5 story text here..."},
    {"page": 6, "text": "Page 6 story text here..."}
  ],
  "imagePrompts": [
    "Detailed image prompt for page 1 illustration...",
    "Detailed image prompt for page 2 illustration...",
    "Detailed image prompt for page 3 illustration...",
    "Detailed image prompt for page 4 illustration...",
    "Detailed image prompt for page 5 illustration...",
    "Detailed image prompt for page 6 illustration..."
  ]
}`;

  try {
    const response = await fetch(
      'https://api-integrations.appmedo.com/app-7fe84onkvoxt/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      console.error('Custom story generation API error:', response.status);
      throw new Error('Failed to generate custom story');
    }

    const text = await response.text();
    
    const lines = text.split('\n').filter(line => line.trim().startsWith('data:'));
    let fullText = '';
    
    for (const line of lines) {
      try {
        const jsonStr = line.replace(/^data:\s*/, '');
        if (jsonStr.trim() === '[DONE]') continue;
        
        const data = JSON.parse(jsonStr);
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          fullText += content;
        }
      } catch (e) {
        console.error('Error parsing SSE line:', e);
      }
    }
    
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const storyData = JSON.parse(jsonMatch[0]);
      return storyData;
    }
    
    throw new Error('Failed to parse story data');
  } catch (error) {
    console.error('Custom story generation error:', error);
    
    return {
      pages: [
        { page: 1, text: `Once upon a time, there was a brave child named ${childName}.` },
        { page: 2, text: `${childName} loved to explore and discover new things every day.` },
        { page: 3, text: `One day, ${childName} found something magical and wonderful.` },
        { page: 4, text: `${childName} showed kindness and courage in every adventure.` },
        { page: 5, text: `With the help of friends, ${childName} overcame every challenge.` },
        { page: 6, text: `And ${childName} lived happily, ready for the next adventure!` }
      ],
      imagePrompts: [
        `A cheerful ${childAge}-year-old child in a colorful, magical setting`,
        `A child exploring a beautiful, enchanted environment`,
        `A child discovering something magical and glowing`,
        `A brave child showing courage and kindness`,
        `A child with friends working together happily`,
        `A happy child celebrating success in a bright, joyful scene`
      ]
    };
  }
};
