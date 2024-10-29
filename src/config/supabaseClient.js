import { createClient } from '@supabase/supabase-js'

console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_KEY)

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY,
    { 
        auth: {
            autoRefreshToken: true,
            persistSession: true,
        },
        db: {schema: 'public'} 
    }
)

export default supabase
