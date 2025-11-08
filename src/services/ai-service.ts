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
    const errorData = await response.json();
    if (errorData.status === 999) {
      throw new Error(errorData.msg || 'Story generation failed');
    }
    throw new Error('Failed to generate story text');
  }

  const data: LLMResponse = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || templateText.replace(/{child_name}/g, childName);
  return text;
};

export const generateStoryImage = async (prompt: string): Promise<string> => {
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
    const errorData = await response.json();
    if (errorData.status === 999) {
      throw new Error(errorData.msg || 'Image generation failed');
    }
    throw new Error('Failed to generate image');
  }

  const data: ImageGenerationResponse = await response.json();
  const markdownText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  const imageMatch = markdownText.match(/!\[.*?\]\((data:image\/[^)]+)\)/);
  if (imageMatch && imageMatch[1]) {
    return imageMatch[1];
  }
  
  throw new Error('No image data found in response');
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
