"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, AuthUser, LoginCredentials } from './auth-types'
import { getAccountByEmail } from './auth-accounts'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        localStorage.removeItem('auth_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const account = getAccountByEmail(credentials.email)
      
      if (!account) {
        setError('Invalid email address')
        return false
      }

      if (account.password !== credentials.password) {
        setError('Invalid password')
        return false
      }

      if (account.user.role !== credentials.role) {
        setError('Invalid role for this account')
        return false
      }

      // Store user data
      localStorage.setItem('auth_user', JSON.stringify(account.user))
      setUser(account.user)
      setIsAuthenticated(true)
      
      return true
    } catch (err) {
      setError('An error occurred during login')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
