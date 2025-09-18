

"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Edit, MoreHorizontal, Plus, RefreshCw, Trash2, User, UserCheck, UserX } from 'lucide-react'
import { User as UserType } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function SubscriptionPlansContent() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getUsers()
      if (response.success) {
        setUsers(response.data)
      } else {
        setError(response.message || 'Failed to fetch users')
      }
    } catch (err) {
      setError('An error occurred while fetching users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleStatusUpdate = async (userId: string, status: 'active' | 'inactive') => {
    try {
      setProcessing(userId)
      const response = await ApiService.updateUserStatus(userId, status)
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, status }
            : user
        ))
      } else {
        setError(response.message || 'Failed to update user status')
      }
    } catch (err) {
      setError('An error occurred while updating user status')
    } finally {
      setProcessing(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      setProcessing(userId)
      const response = await ApiService.deleteUser(userId)
      if (response.success) {
        setUsers(prev => prev.filter(user => user.id !== userId))
      } else {
        setError(response.message || 'Failed to delete user')
      }
    } catch (err) {
      setError('An error occurred while deleting user')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: UserType['status']) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <UserX className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: UserType['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    return user.status === filter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage employee information and access</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage employee information and access</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage employee information and access</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchUsers} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by status:</span>
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <span>{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => handleStatusUpdate(user.id, user.status === 'active' ? 'inactive' : 'active')}
                            disabled={processing === user.id}
                            variant="outline"
                            size="sm"
                          >
                            {processing === user.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : user.status === 'active' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => setEditingUser(user)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={processing === user.id}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new employee account. Fill in the required information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input id="fullName" className="col-span-3" placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" placeholder="john@company.com" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" className="col-span-3" placeholder="0666786789" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="idCard" className="text-right">
                ID Card
              </Label>
              <Input id="idCard" className="col-span-3" placeholder="123456789" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input id="department" className="col-span-3" placeholder="Informatique" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input id="position" className="col-span-3" placeholder="Manager" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Application Name</h3>
                <p className="text-sm text-muted-foreground">The name displayed in the application</p>
              </div>
              <Input defaultValue="Sicada Dashboard" className="w-48" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Default Language</h3>
                <p className="text-sm text-muted-foreground">Choose the default language for the interface</p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Timezone</h3>
                <p className="text-sm text-muted-foreground">Set the default timezone for the application</p>
              </div>
              <Select defaultValue="utc">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="cet">CET (Central European Time)</SelectItem>
                  <SelectItem value="est">EST (Eastern Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Button variant="outline" size="sm">Disable</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Session Timeout</h3>
                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Password Policy</h3>
                <p className="text-sm text-muted-foreground">Configure password requirements</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>View system status and version information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Application Version</h3>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>
              <div>
                <h3 className="font-medium">Last Updated</h3>
                <p className="text-sm text-muted-foreground">January 15, 2024</p>
              </div>
              <div>
                <h3 className="font-medium">Database Status</h3>
                <p className="text-sm text-green-600">Connected</p>
              </div>
              <div>
                <h3 className="font-medium">API Status</h3>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
