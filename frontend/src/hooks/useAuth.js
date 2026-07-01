import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'
import { getProfile } from '@/services/authService'

export function useAuth() {
  const {
    user,
    session,
    profile,
    loading,
    setUser,
    setSession,
    setProfile,
    setLoading,
    clearAuth,
  } = useAuthStore()

  useEffect(() => {
    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1500))

    Promise.all([supabase.auth.getSession(), minLoadTime]).then(
      async ([{ data }]) => {
        setSession(data.session)
        setUser(data.session?.user ?? null)
        if (data.session) {
          try {
            const profileData = await getProfile(data.session.access_token)
            setProfile(profileData)
          } catch (err) {
            console.error('Failed to fetch profile:', err)
          }
        }
        setLoading(false)
      }
    )

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session) {
          try {
            const profileData = await getProfile(session.access_token)
            setProfile(profileData)
          } catch (err) {
            console.error('Failed to fetch profile:', err)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, session, profile, loading, clearAuth }
}
