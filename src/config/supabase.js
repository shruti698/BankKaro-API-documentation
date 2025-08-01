import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amvdndglahktcmmtlgtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtdmRuZGdsYWhrdGNtbXRsZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTQ4OTIsImV4cCI6MjA2OTUzMDg5Mn0.PuPbuCWDve-YuwHM3fJe_Y62_6kOXCoYKXHV4r1koYM';

export const supabase = createClient(supabaseUrl, supabaseKey); 