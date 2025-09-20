"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw, Landmark, Car, MapPin, Clock, Settings, TrendingUp, BarChart3, FileText } from 'lucide-react'
import { ParkingRequest, ParkingLocation, DashboardStats } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function WilayaDashboardContent() {
  const [parkingRequests, setParkingRequests] = useState<ParkingRequest[]>([])
  const [parkingLocations, setParkingLocations] = useState<ParkingLocation[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [requestsResponse, locationsResponse, statsResponse] = await Promise.all([
        ApiService.getParkingRequests(),
        ApiService.getParkingLocations(),
        ApiService.getDashboardStats()
      ])

      if (requestsResponse.success) {
        setParkingRequests(requestsResponse.data)
      }
      
      if (locationsResponse.success) {
        setParkingLocations(locationsResponse.data)
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
          <h1 className="text-3xl font-bold tracking-tight">Wilaya Portal Dashboard</h1>
          <p className="text-muted-foreground">Gestion des parkings et demandes d'ouverture</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Wilaya Portal Dashboard</h1>
          <p className="text-muted-foreground">Gestion des parkings et demandes d'ouverture</p>
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

  const parkingStats = {
    totalParkings: parkingLocations.length,
    activeParkings: parkingLocations.filter(p => p.status === 'active').length,
    totalSpaces: parkingLocations.reduce((sum, p) => sum + p.totalSpaces, 0),
    availableSpaces: parkingLocations.reduce((sum, p) => sum + p.availableSpaces, 0),
    totalRequests: parkingRequests.length,
    pendingRequests: parkingRequests.filter(r => r.status === 'pending').length,
    approvedRequests: parkingRequests.filter(r => r.status === 'approved').length,
    inReviewRequests: parkingRequests.filter(r => r.status === 'in_review').length,
    rejectedRequests: parkingRequests.filter(r => r.status === 'rejected').length
  }

  const getOccupancyRate = (total: number, available: number) => {
    const occupied = total - available
    return Math.round((occupied / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wilaya Portal Dashboard</h1>
          <p className="text-muted-foreground">Gestion des parkings et demandes d'ouverture</p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Parking Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parkings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingStats.totalParkings}</div>
            <p className="text-xs text-muted-foreground">
              {parkingStats.activeParkings} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Places Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingStats.totalSpaces}</div>
            <p className="text-xs text-muted-foreground">
              {parkingStats.availableSpaces} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkingStats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {parkingStats.pendingRequests} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parkingStats.totalSpaces > 0 ? Math.round(
                ((parkingStats.totalSpaces - parkingStats.availableSpaces) / parkingStats.totalSpaces) * 100
              ) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Moyenne générale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parking Management Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Demandes d'Ouverture</span>
            </CardTitle>
            <CardDescription>Gestion des demandes de nouveaux parkings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Demandes</span>
                <Badge variant="secondary">{parkingStats.totalRequests}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">En Attente</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {parkingStats.pendingRequests}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">En Cours d'Examen</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {parkingStats.inReviewRequests}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approuvées</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {parkingStats.approvedRequests}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rejetées</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {parkingStats.rejectedRequests}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-green-500" />
              <span>Parkings Actifs</span>
            </CardTitle>
            <CardDescription>Gestion des parkings existants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Parkings</span>
                <Badge variant="secondary">{parkingStats.totalParkings}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Parkings Actifs</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {parkingStats.activeParkings}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Places Total</span>
                <Badge variant="secondary">{parkingStats.totalSpaces}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Places Disponibles</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {parkingStats.availableSpaces}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taux d'Occupation</span>
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {parkingStats.totalSpaces > 0 ? Math.round(
                    ((parkingStats.totalSpaces - parkingStats.availableSpaces) / parkingStats.totalSpaces) * 100
                  ) : 0}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>Dernières demandes et mises à jour de parkings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parkingRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{request.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Demande de {request.requester.name} • {request.requestedSpaces} places
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'in_review' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {request.status === 'pending' ? 'En attente' :
                     request.status === 'in_review' ? 'En examen' :
                     request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                  </Badge>
                </div>
              </div>
            ))}
            {parkingLocations.slice(0, 3).map((parking) => (
              <div key={parking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Car className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{parking.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {parking.availableSpaces}/{parking.totalSpaces} places disponibles
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={
                    parking.status === 'active' ? 'bg-green-100 text-green-800' :
                    parking.status === 'full' ? 'bg-orange-100 text-orange-800' :
                    parking.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {parking.status === 'active' ? 'Actif' :
                     parking.status === 'full' ? 'Complet' :
                     parking.status === 'maintenance' ? 'Maintenance' : 'Inactif'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Accès rapide aux fonctions de gestion des parkings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>Demandes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Car className="h-6 w-6" />
              <span>Liste Parkings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Rapports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="h-6 w-6" />
              <span>Paramètres</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
