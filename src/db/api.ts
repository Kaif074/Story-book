import { supabase } from "./supabase";
import type { StoryTemplate, Storybook, StorybookImage, StorybookWithDetails } from "@/types/types";

export const getUserId = (): string => {
  let userId = localStorage.getItem('storybook_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('storybook_user_id', userId);
  }
  return userId;
};

export const getStoryTemplates = async (): Promise<StoryTemplate[]> => {
  const { data, error } = await supabase
    .from('story_templates')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getStoryTemplateById = async (id: string): Promise<StoryTemplate | null> => {
  const { data, error } = await supabase
    .from('story_templates')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createStorybook = async (storybook: Partial<Storybook>): Promise<Storybook> => {
  const { data, error } = await supabase
    .from('storybooks')
    .insert({
      user_id: storybook.user_id || getUserId(),
      child_name: storybook.child_name || '',
      child_age: storybook.child_age || 5,
      child_gender: storybook.child_gender,
      template_id: storybook.template_id,
      photo_url: storybook.photo_url,
      story_content: storybook.story_content || [],
      status: storybook.status || 'pending'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateStorybook = async (id: string, updates: Partial<Storybook>): Promise<Storybook> => {
  const { data, error } = await supabase
    .from('storybooks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getStorybookById = async (id: string): Promise<StorybookWithDetails | null> => {
  const { data: storybook, error: storybookError } = await supabase
    .from('storybooks')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (storybookError) throw storybookError;
  if (!storybook) return null;

  const { data: template } = await supabase
    .from('story_templates')
    .select('*')
    .eq('id', storybook.template_id)
    .maybeSingle();

  const { data: images } = await supabase
    .from('storybook_images')
    .select('*')
    .eq('storybook_id', id)
    .order('page_number', { ascending: true });

  return {
    ...storybook,
    template: template || undefined,
    images: Array.isArray(images) ? images : []
  };
};

export const getUserStorybooks = async (userId?: string): Promise<Storybook[]> => {
  const uid = userId || getUserId();
  const { data, error } = await supabase
    .from('storybooks')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createStorybookImage = async (image: Partial<StorybookImage>): Promise<StorybookImage> => {
  const { data, error } = await supabase
    .from('storybook_images')
    .insert({
      storybook_id: image.storybook_id || '',
      page_number: image.page_number || 0,
      image_url: image.image_url || '',
      prompt: image.prompt
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const uploadPhoto = async (file: File, storybookId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${storybookId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('app-7fe84onkvoxt_photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('app-7fe84onkvoxt_photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteStorybook = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('storybooks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
