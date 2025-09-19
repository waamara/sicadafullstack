"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw, Shield, Users, Ticket, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { Ticket as TicketType, User, DashboardStats } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function PoliceDashboardContent() {
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [ticketsResponse, usersResponse, statsResponse] = await Promise.all([
        ApiService.getTickets(),
        ApiService.getUsers(),
        ApiService.getDashboardStats()
      ])

      if (ticketsResponse.success) {
        const policeTickets = ticketsResponse.data.filter(ticket => ticket.portal === 'police')
        setTickets(policeTickets)
      }
      
      if (usersResponse.success) {
        const policeUsers = usersResponse.data.filter(user => user.portal === 'police')
        setUsers(policeUsers)
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Police Portal Dashboard</h1>
          <p className="text-muted-foreground">Monitor police activities and case management</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Police Portal Dashboard</h1>
          <p className="text-muted-foreground">Monitor police activities and case management</p>
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

  const policeStats = {
    totalOfficers: users.length,
    activeOfficers: users.filter(user => user.status === 'active').length,
    totalCases: tickets.length,
    complaints: tickets.filter(ticket => ticket.type === 'complaint').length,
    violations: tickets.filter(ticket => ticket.type === 'violation').length,
    pendingCases: tickets.filter(ticket => ticket.status === 'pending').length,
    inProgressCases: tickets.filter(ticket => ticket.status === 'in_progress').length,
    resolvedCases: tickets.filter(ticket => ticket.status === 'resolved').length,
    resolutionRate: tickets.length ? Math.round((tickets.filter(ticket => ticket.status === 'resolved').length / tickets.length) * 100) : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Police Portal Dashboard</h1>
          <p className="text-muted-foreground">Monitor police activities and case management</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policeStats.totalOfficers}</div>
            <p className="text-xs text-muted-foreground">
              {policeStats.activeOfficers} active officers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policeStats.totalCases}</div>
            <p className="text-xs text-muted-foreground">
              {policeStats.complaints} complaints, {policeStats.violations} violations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policeStats.pendingCases}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policeStats.resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Cases resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Latest complaints and violations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.type === 'complaint' ? 'Citizen Complaint' : 'Parking Violation'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={
                      ticket.type === 'complaint' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }>
                      {ticket.type}
                    </Badge>
                    <Badge variant="outline" className={
                      ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Officer Status</CardTitle>
            <CardDescription>Current officer activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((officer) => (
                <div key={officer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{officer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{officer.rank} • {officer.badgeNumber}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    officer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }>
                    {officer.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-6 w-6" />
              <span>View Complaints</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Shield className="h-6 w-6" />
              <span>View Violations</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Officers</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
