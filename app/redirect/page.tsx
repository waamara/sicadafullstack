"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function RedirectPage() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login')
        return
      }

      // Redirect to appropriate portal based on user's portal
      switch (user.portal) {
        case 'business':
          router.push('/')
          break
        case 'police':
          router.push('/police')
          break
        case 'wilaya':
          router.push('/wilaya')
          break
        default:
          router.push('/login')
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
