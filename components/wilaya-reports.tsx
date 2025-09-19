"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw, FileText, Download, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import { Ticket as TicketType, User, DashboardStats } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function WilayaReportsContent() {
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
        setTickets(ticketsResponse.data)
      }
      
      if (usersResponse.success) {
        setUsers(usersResponse.data)
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

  const generateReport = () => {
    // In a real application, this would generate and download a report
    alert('Report generation feature would be implemented here')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate reports and view system analytics</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate reports and view system analytics</p>
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

  const businessTickets = tickets.filter(t => t.portal === 'business')
  const policeTickets = tickets.filter(t => t.portal === 'police')
  const businessUsers = users.filter(u => u.portal === 'business')
  const policeUsers = users.filter(u => u.portal === 'police')

  const reportData = {
    totalUsers: users.length,
    totalTickets: tickets.length,
    businessRequests: businessTickets.length,
    policeCases: policeTickets.length,
    complaints: policeTickets.filter(t => t.type === 'complaint').length,
    violations: policeTickets.filter(t => t.type === 'violation').length,
    pendingBusiness: businessTickets.filter(t => t.status === 'pending').length,
    pendingPolice: policeTickets.filter(t => t.status === 'pending').length,
    resolvedBusiness: businessTickets.filter(t => t.status === 'approved' || t.status === 'rejected').length,
    resolvedPolice: policeTickets.filter(t => t.status === 'resolved').length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate reports and view system analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={generateReport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {businessUsers.length} business, {policeUsers.length} police
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.businessRequests} business, {reportData.policeCases} police
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.pendingBusiness + reportData.pendingPolice}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.pendingBusiness} business, {reportData.pendingPolice} police
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.resolvedBusiness + reportData.resolvedPolice}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.resolvedBusiness} business, {reportData.resolvedPolice} police
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Portal Report</CardTitle>
            <CardDescription>Employee requests and management statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Employees</span>
                <Badge variant="secondary">{businessUsers.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Employees</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {businessUsers.filter(u => u.status === 'active').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Requests</span>
                <Badge variant="secondary">{reportData.businessRequests}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Requests</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {reportData.pendingBusiness}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolved Requests</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {reportData.resolvedBusiness}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolution Rate</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {reportData.businessRequests ? Math.round((reportData.resolvedBusiness / reportData.businessRequests) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Police Portal Report</CardTitle>
            <CardDescription>Citizen complaints and violations statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Officers</span>
                <Badge variant="secondary">{policeUsers.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Officers</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {policeUsers.filter(u => u.status === 'active').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Cases</span>
                <Badge variant="secondary">{reportData.policeCases}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Citizen Complaints</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {reportData.complaints}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Parking Violations</span>
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {reportData.violations}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Cases</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {reportData.pendingPolice}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolved Cases</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {reportData.resolvedPolice}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolution Rate</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {reportData.policeCases ? Math.round((reportData.resolvedPolice / reportData.policeCases) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>Generate detailed reports for different time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Daily Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Weekly Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Monthly Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
