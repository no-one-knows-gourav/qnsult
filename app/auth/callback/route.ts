import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Persist Google OAuth tokens so ADK agents can call Gmail/Calendar on the user's behalf
      const { provider_token, provider_refresh_token } = data.session
      if (provider_token) {
        await supabase.from('user_tokens').upsert({
          user_id: data.session.user.id,
          provider: 'google',
          access_token: provider_token,
          refresh_token: provider_refresh_token ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,provider' })
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
