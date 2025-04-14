
// This is a Supabase Edge Function that checks if a table exists in the database
// Create an RPC function to check if a table exists

export async function createTableExistenceFunction(supabase) {
  try {
    const { error } = await supabase.rpc('does_table_exist', { table_name: 'test' });
    
    // If the function already exists, we'll get a specific error
    if (error && error.message.includes('does not exist')) {
      // Create the function
      const { error: createError } = await supabase.sql`
        CREATE OR REPLACE FUNCTION public.does_table_exist(table_name text)
        RETURNS boolean
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          table_exists boolean;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public'
            AND table_name = $1
          ) INTO table_exists;
          
          RETURN table_exists;
        END;
        $$;
      `;
      
      if (createError) {
        console.error('Error creating table existence function:', createError);
        return false;
      }
      
      return true;
    }
    
    // If we get here, the function already exists
    return true;
  } catch (err) {
    console.error('Error checking/creating table existence function:', err);
    return false;
  }
}
