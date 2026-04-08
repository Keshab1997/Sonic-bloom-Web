// Supabase removed — using localStorage only
export const supabase = null

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Playlist {
  id: string
  name: string
  description?: string
  cover_url?: string
  created_at: string
  updated_at: string
}

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  youtube_id?: string
  cover_url?: string
  audio_url?: string
}
