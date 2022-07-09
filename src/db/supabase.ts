import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string

export const createClient = () => createSupabaseClient(supabaseUrl, supabaseKey)
