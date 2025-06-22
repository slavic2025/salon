import { createClient } from './supabase-server'
import { AppError } from './errors'

const BUCKET_NAME = 'avatars' // Numele bucket-ului tău din Supabase Storage

/**
 * Încarcă o imagine în Supabase Storage și returnează URL-ul public.
 * @param file - Fișierul de încărcat, de tip File.
 * @param fileName - Numele unic pentru fișier (ex: user-id.jpg).
 */
export async function uploadImage(file: File, fileName: string): Promise<string> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
    cacheControl: '3600', // Cache pentru o oră
    upsert: true, // Suprascrie fișierul dacă există deja
  })

  if (error) {
    throw new AppError('Eroare la încărcarea imaginii.', error)
  }

  // Obținem URL-ul public al fișierului încărcat
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

  return publicUrl
}

/**
 * Returnează URL-ul pentru un avatar default.
 */
export function getDefaultAvatarUrl(): string {
  // Poți pune aici URL-ul unei imagini default pe care ai încărcat-o manual în bucket
  return `https://uyzertmffnwgesiqaete.supabase.co/storage/v1/object/public/avatars//Gemini_Generated_Image_ab08v8ab08v8ab08.png`
}
