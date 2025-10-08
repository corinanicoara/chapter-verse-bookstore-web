import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbpahyweiqnzgfjmumwk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZicGFoeXdlaXFuemdmam11bXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTU4ODIsImV4cCI6MjA3NTQ3MTg4Mn0.e_6iXxxeKfDzhucN5zFEIBUIERrGOshd-4YKxQDZEfw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
