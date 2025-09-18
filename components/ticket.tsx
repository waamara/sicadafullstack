
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle, Clock, Filter, RefreshCw, Ticket, User, Phone, Mail, CreditCard, Building, Briefcase } from 'lucide-react'
import { Ticket as TicketType } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function SupportContent() {
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getTickets()
      if (response.success) {
        setTickets(response.data)
      } else {
        setError(response.message || 'Failed to fetch tickets')
      }
    } catch (err) {
      setError('An error occurred while fetching tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleStatusUpdate = async (ticketId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessing(ticketId)
      const response = await ApiService.updateTicketStatus(ticketId, status)
      if (response.success) {
        // Update the ticket in the local state
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId 
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
            : ticket
        ))
      } else {
        setError(response.message || 'Failed to update ticket status')
      }
    } catch (err) {
      setError('An error occurred while updating ticket status')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: TicketType['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: TicketType['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityColor = (priority: TicketType['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'high':
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
    if (filter === 'all') return true
    return ticket.status === filter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground">Manage and review support requests</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground">Manage and review support requests</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and review support requests</p>
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
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tickets found for the selected filter.</p>
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
                        Created {formatDate(ticket.createdAt)}
                        {ticket.updatedAt !== ticket.createdAt && (
                          <span> • Updated {formatDate(ticket.updatedAt)}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* User Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Requester Information
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
                    </div>
                  </div>

                  {/* Department Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Department Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.user.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.user.position}</span>
                      </div>
                    </div>
                  </div>
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

                {/* Actions */}
                {ticket.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleStatusUpdate(ticket.id, 'approved')}
                        disabled={processing === ticket.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processing === ticket.id ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(ticket.id, 'rejected')}
                        disabled={processing === ticket.id}
                        size="sm"
                        variant="destructive"
                      >
                        {processing === ticket.id ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

