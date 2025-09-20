"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Shield, Landmark, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getAccountByEmail } from '@/lib/auth-accounts'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'employee' | 'police_officer' | 'admin'>('employee')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, isLoading, error, clearError, user } = useAuth()

  const roleConfigs = {
    employee: {
      title: 'Business Portal',
      description: 'Business admin access to company resources and user management',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    police_officer: {
      title: 'Police Portal',
      description: 'Law enforcement access to citizen complaints',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    admin: {
      title: 'Wilaya Portal',
      description: 'Administrative oversight and management',
      icon: Landmark,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  }

  const currentConfig = roleConfigs[role]

  // Demo accounts for quick login
  const demoAccounts = {
    employee: [
      { email: 'admin@company.com', password: 'admin123', name: 'Sarah Johnson (Admin)' }
    ],
    police_officer: [
      { email: 'officer@police.dz', password: 'police123', name: 'Officer Ahmed Benali' },
      { email: 'senior@police.dz', password: 'senior123', name: 'Officer Fatima Mansouri' }
    ],
    admin: [
      { email: 'admin@wilaya.dz', password: 'wilaya123', name: 'Admin System' }
    ]
  }

  const handleRoleChange = (newRole: 'employee' | 'police_officer' | 'admin') => {
    setRole(newRole)
    setEmail('')
    setPassword('')
    clearError()
  }

  const handleAccountSelect = (accountEmail: string) => {
    const account = demoAccounts[role].find(acc => acc.email === accountEmail)
    if (account) {
      setEmail(account.email)
      setPassword(account.password)
      clearError()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email || !password) {
      return
    }

    // Map frontend role to backend role
    const backendRole = role === 'employee' ? 'admin' : role
    const success = await login({ email, password, role: backendRole })
    if (success) {
      // Get the user data from the login response or use the updated user state
      const account = getAccountByEmail(email)
      if (account) {
        // Redirect based on user's portal
        switch (account.user.portal) {
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
            router.push('/')
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Portal Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role and sign in to your portal
          </p>
        </div>

        <Card className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-2`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${currentConfig.bgColor}`}>
                <currentConfig.icon className={`h-8 w-8 ${currentConfig.color}`} />
              </div>
            </div>
            <CardTitle className={currentConfig.color}>
              {currentConfig.title}
            </CardTitle>
            <CardDescription>
              {currentConfig.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Select Portal</Label>
                <Select value={role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span>Business Portal (Admin)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="police_officer">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        <span>Police Portal</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center space-x-2">
                        <Landmark className="h-4 w-4 text-green-600" />
                        <span>Wilaya Portal</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Account Selection */}
              <div className="space-y-2">
                <Label htmlFor="account">Quick Login (Select Account)</Label>
                <Select onValueChange={handleAccountSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a demo account" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoAccounts[role].map((account) => (
                      <SelectItem key={account.email} value={account.email}>
                        <div className="flex flex-col">
                          <span className="font-medium">{account.name}</span>
                          <span className="text-sm text-gray-500">{account.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manual Login Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                {role === 'employee' ? 'Business Admin Credentials:' : 'Demo Credentials:'}
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                {demoAccounts[role].map((account) => (
                  <div key={account.email} className="flex justify-between">
                    <span>{account.name}:</span>
                    <span className="font-mono">{account.password}</span>
                  </div>
                ))}
              </div>
              {role === 'employee' && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  All business users have admin privileges and can manage other users
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
