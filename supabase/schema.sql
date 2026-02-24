-- Supabase Schema for Study App

-- 1. Tours Table
CREATE TABLE IF NOT EXISTS public.tours (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  sub_name TEXT,
  thumbnail TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tour Tracks Table
CREATE TABLE IF NOT EXISTS public.tour_tracks (
  id BIGINT PRIMARY KEY,
  tour_id BIGINT REFERENCES public.tours(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  thumbnail TEXT,
  media_url TEXT,
  play_time TEXT,
  index INTEGER,
  is_sample BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_tracks ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow public read access on tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tour_tracks" ON public.tour_tracks FOR SELECT USING (true);
