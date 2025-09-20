"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, Clock, Filter, RefreshCw, Shield, MapPin, Camera, User, Phone, Mail, CreditCard, Home, Eye } from 'lucide-react'
import { Ticket as TicketType } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function PoliceComplaintsContent() {
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [resolution, setResolution] = useState('')

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getTicketsByPortal('police')
      console.log('API Response:', response) // Debug log
      if (response.success) {
        console.log('Raw tickets data:', response.data) // Debug log
        // Filter only complaints (portal filtering is done by backend)
        const complaintTickets = response.data.filter(ticket => 
          ticket.type === 'complaint'
        )
        console.log('Filtered complaint tickets:', complaintTickets) // Debug log
        setTickets(complaintTickets)
      } else {
        setError(response.message || 'Failed to fetch complaints')
      }
    } catch (err) {
      console.error('Fetch tickets error:', err) // Debug log
      setError('An error occurred while fetching complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleStatusUpdate = async (ticketId: string, status: 'in_progress' | 'resolved') => {
    try {
      setProcessing(ticketId)
      const response = await ApiService.updateTicketStatus(ticketId, status)
      if (response.success) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket
        ))
      } else {
        setError(response.message || 'Failed to update complaint status')
      }
    } catch (err) {
      setError('An error occurred while updating complaint status')
    } finally {
      setProcessing(null)
    }
  }

  const handleResolveTicket = async (ticketId: string) => {
    if (!resolution.trim()) return
    
    try {
      setProcessing(ticketId)
      const response = await ApiService.updateTicketResolution(ticketId, 'resolved', resolution)
      if (response.success) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId 
            ? { 
                ...ticket, 
                status: 'resolved', 
                resolution: resolution,
                updatedAt: new Date().toISOString() 
              }
            : ticket
        ))
        setSelectedTicket(null)
        setResolution('')
      } else {
        setError(response.message || 'Failed to resolve complaint')
      }
    } catch (err) {
      setError('An error occurred while resolving complaint')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: TicketType['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: TicketType['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: TicketType['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === 'all') return true
    return ticket.status === statusFilter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Citizen Complaints</h1>
            <p className="text-muted-foreground">Manage complaints from citizens</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Citizen Complaints</h1>
            <p className="text-muted-foreground">Manage complaints from citizens</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Citizen Complaints</h1>
          <p className="text-muted-foreground">Manage complaints from citizens</p>
        </div>
        <Button onClick={fetchTickets} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter by status:</span>
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No complaints found for the selected filter.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(ticket.status)}
                    <div>
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <CardDescription>
                        Citizen Complaint • Created {formatDate(ticket.createdAt)}
                        {ticket.updatedAt !== ticket.createdAt && (
                          <span> • Updated {formatDate(ticket.updatedAt)}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      complaint
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Complainant Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Complainant Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.user.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.user.idCard}</span>
                      </div>
                      {ticket.user.address && (
                        <div className="flex items-center space-x-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.user.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Information */}
                  {ticket.location && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Location Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{ticket.location.address}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {ticket.description && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  </div>
                )}

                {/* Images */}
                {ticket.images && ticket.images.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Evidence Photos
                    </h3>
                    <div className="flex space-x-2">
                      {ticket.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Evidence ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => window.open(image, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution */}
                {ticket.resolution && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Resolution
                    </h3>
                    <p className="text-sm text-muted-foreground">{ticket.resolution}</p>
                  </div>
                )}

                {/* Actions */}
                {ticket.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleStatusUpdate(ticket.id, 'in_progress')}
                        disabled={processing === ticket.id}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {processing === ticket.id ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-2" />
                        )}
                        Take Action
                      </Button>
                    </div>
                  </div>
                )}

                {ticket.status === 'in_progress' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setSelectedTicket(ticket)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Resolution Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resolve Complaint</DialogTitle>
            <DialogDescription>
              Provide details about how this complaint was resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Details</label>
              <Textarea
                placeholder="Describe the actions taken to resolve this complaint..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedTicket && handleResolveTicket(selectedTicket.id)}
              disabled={!resolution.trim() || processing === selectedTicket?.id}
            >
              {processing === selectedTicket?.id ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Resolve Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
