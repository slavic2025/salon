// app/auth/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase' // Import the Supabase client

export async function signIn(email: string, password: string) {
  const supabase = await createClient() // Use the Supabase client from lib/supabase

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { error: error.message }
  }

  // After successful sign-in, fetch the user's role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    // Handle the error appropriately, perhaps redirect to an error page or display a message
    return { error: 'Login successful, but an error occurred fetching user role.' }
  }

  // If the user's role is 'admin' or 'stylist', redirect to the admin panel
  if (profile?.role === 'admin' || profile?.role === 'stylist') {
    redirect('/admin')
  } else {
    // Handle other roles or redirect to a default page
    redirect('/') // Example: redirect to the home page
  }
}

export async function signOut() {
  const supabase = await createClient() // Use the Supabase client from lib/supabase

  await supabase.auth.signOut()
  redirect('/login')
}
