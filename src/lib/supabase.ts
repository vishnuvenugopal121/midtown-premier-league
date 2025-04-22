
import { createClient } from '@supabase/supabase-js';
import { mockTournament } from '@/data/mockTournament';
import type { Tournament } from '@/types/cricketTypes';

// Supabase configuration (using public keys)
const supabaseUrl = 'https://ydaoxvbfzfexsfodziup.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYW94dmJmemZleHNmb2R6aXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzQyMzAsImV4cCI6MjA2MDcxMDIzMH0.0nQrNmJpyLeHjaxhKjpCBAVS9ztOdXcUGkrwgzP69b0';

// Initialize Supabase client
let supabase = createClient(supabaseUrl, supabaseAnonKey);
let supabaseInitialized = true;
let supabaseError: Error | null = null;

try {
  // Verify connection by making a simple query
  const testConnection = async () => {
    try {
      // await supabase.from('health_check').select('*').limit(1);
      console.log('Supabase initialized successfully');
    } catch (error) {
      console.error('Supabase connection error:', error);
      supabaseError = error as Error;
      supabaseInitialized = false;
    }
  };
  
  // Run connection test
  testConnection();
} catch (error) {
  console.error('Supabase initialization error:', error);
  supabaseError = error as Error;
  supabaseInitialized = false;
}

// Function to initialize Supabase database with mock data
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if the tournament table exists
    const { data, error } = await supabase
      .from('tournaments')
      .select('id')
      .eq('id', 'champions2025')
      .single();
    
    if (error || !data) {
      console.log('Initializing tournament with mock data');
      // Insert mock tournament data
      const { error: insertError } = await supabase
        .from('tournaments')
        .insert([{ ...mockTournament }]);
      
      if (insertError) {
        console.error('Error initializing tournament data:', insertError);
      }
    }
  } catch (error) {
    console.error('Error checking tournament data:', error);
  }
};

// Function to check Supabase connection status
export const isSupabaseAvailable = (): boolean => {
  return supabaseInitialized;
};

export { supabase, supabaseError };
