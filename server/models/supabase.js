const { createClient } = require('@supabase/supabase-js')

// Ensure environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error('Missing environment variables')
}

console.log('Connecting to Supabase with URL:', process.env.SUPABASE_URL)
// Initialize Supabase client
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SECRET_KEY
// )


module.exports = {
    connect(){
        return createClient(
            process.env.SUPABASE_URL, 
            process.env.SUPABASE_SECRET_KEY)
    }
}