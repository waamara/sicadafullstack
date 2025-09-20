"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, RefreshCw, Shield, UserCheck, UserX, Phone, Mail, CreditCard, MapPin } from 'lucide-react'
import { User } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function PoliceOfficersContent() {
  const [officers, setOfficers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchOfficers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getUsers()
      if (response.success) {
        // Filter only police officers
        const policeOfficers = response.data.filter(user => 
          user.portal === 'police' && user.role === 'police_officer'
        )
        setOfficers(policeOfficers)
      } else {
        setError(response.message || 'Failed to fetch officers')
      }
    } catch (err) {
      setError('An error occurred while fetching officers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOfficers()
  }, [])

  const handleStatusUpdate = async (officerId: string, status: 'active' | 'inactive') => {
    try {
      setProcessing(officerId)
      const response = await ApiService.updateUserStatus(officerId, status)
      if (response.success) {
        setOfficers(prev => prev.map(officer => 
          officer.id === officerId 
            ? { ...officer, status }
            : officer
        ))
      } else {
        setError(response.message || 'Failed to update officer status')
      }
    } catch (err) {
      setError('An error occurred while updating officer status')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <UserX className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: User['status']) => {
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

  const filteredOfficers = officers.filter(officer => {
    if (filter === 'all') return true
    return officer.status === filter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Police Officers</h1>
            <p className="text-muted-foreground">Manage police officer accounts and information</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
            <h1 className="text-3xl font-bold tracking-tight">Police Officers</h1>
            <p className="text-muted-foreground">Manage police officer accounts and information</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Police Officers</h1>
          <p className="text-muted-foreground">Manage police officer accounts and information</p>
        </div>
        <Button onClick={fetchOfficers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by status:</span>
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Officers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Officers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Officer Directory</CardTitle>
          <CardDescription>
            {filteredOfficers.length} officer{filteredOfficers.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOfficers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No officers found for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>Badge Number</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOfficers.map((officer) => (
                    <TableRow key={officer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(officer.status)}
                          <span>{officer.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {officer.badgeNumber}
                        </Badge>
                      </TableCell>
                      <TableCell>{officer.rank}</TableCell>
                      <TableCell>{officer.station}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{officer.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{officer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(officer.status)}>
                          {officer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(officer.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => handleStatusUpdate(officer.id, officer.status === 'active' ? 'inactive' : 'active')}
                            disabled={processing === officer.id}
                            variant="outline"
                            size="sm"
                          >
                            {processing === officer.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : officer.status === 'active' ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
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
    </div>
  )
}
