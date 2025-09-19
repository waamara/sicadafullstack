"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, RefreshCw, MapPin, Car, Clock, Phone, Mail, User, Settings, Eye } from 'lucide-react'
import { ParkingLocation } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function WilayaParkingListContent() {
  const [parkings, setParkings] = useState<ParkingLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance' | 'full'>('all')

  const fetchParkings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getParkingLocations()
      if (response.success) {
        setParkings(response.data)
      } else {
        setError(response.message || 'Failed to fetch parking locations')
      }
    } catch (err) {
      setError('An error occurred while fetching parking locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParkings()
  }, [])

  const getStatusIcon = (status: ParkingLocation['status']) => {
    switch (status) {
      case 'active':
        return <div className="h-2 w-2 bg-green-500 rounded-full" />
      case 'inactive':
        return <div className="h-2 w-2 bg-red-500 rounded-full" />
      case 'maintenance':
        return <div className="h-2 w-2 bg-yellow-500 rounded-full" />
      case 'full':
        return <div className="h-2 w-2 bg-orange-500 rounded-full" />
    }
  }

  const getStatusColor = (status: ParkingLocation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'full':
        return 'bg-orange-100 text-orange-800'
    }
  }

  const getStatusText = (status: ParkingLocation['status']) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'inactive':
        return 'Inactif'
      case 'maintenance':
        return 'Maintenance'
      case 'full':
        return 'Complet'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getOccupancyRate = (total: number, available: number) => {
    const occupied = total - available
    return Math.round((occupied / total) * 100)
  }

  const filteredParkings = parkings.filter(parking => {
    if (statusFilter === 'all') return true
    return parking.status === statusFilter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Liste des Parkings</h1>
            <p className="text-muted-foreground">Gérer tous les parkings de la wilaya</p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
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
            <h1 className="text-3xl font-bold tracking-tight">Liste des Parkings</h1>
            <p className="text-muted-foreground">Gérer tous les parkings de la wilaya</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Liste des Parkings</h1>
          <p className="text-muted-foreground">Gérer tous les parkings de la wilaya</p>
        </div>
        <Button onClick={fetchParkings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parkings</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkings.length}</div>
            <p className="text-xs text-muted-foreground">
              {parkings.filter(p => p.status === 'active').length} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Places Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parkings.reduce((sum, p) => sum + p.totalSpaces, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Places disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Places Disponibles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parkings.reduce((sum, p) => sum + p.availableSpaces, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Actuellement libres
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parkings.length > 0 ? Math.round(
                parkings.reduce((sum, p) => sum + getOccupancyRate(p.totalSpaces, p.availableSpaces), 0) / parkings.length
              ) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Moyenne générale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Filtrer par statut:</span>
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="full">Complet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Parking Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredParkings.map((parking) => (
          <Card key={parking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(parking.status)}
                  <CardTitle className="text-lg">{parking.name}</CardTitle>
                </div>
                <Badge variant="outline" className={getStatusColor(parking.status)}>
                  {getStatusText(parking.status)}
                </Badge>
              </div>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{parking.address}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Capacity Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Capacité totale:</span>
                    <span className="font-medium">{parking.totalSpaces} places</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Places disponibles:</span>
                    <span className="font-medium text-green-600">{parking.availableSpaces}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Taux d'occupation:</span>
                    <span className="font-medium">
                      {getOccupancyRate(parking.totalSpaces, parking.availableSpaces)}%
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium">Tarifs</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium">{formatCurrency(parking.hourlyRate)}</div>
                      <div className="text-muted-foreground">Heure</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{formatCurrency(parking.dailyRate)}</div>
                      <div className="text-muted-foreground">Jour</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{formatCurrency(parking.monthlyRate)}</div>
                      <div className="text-muted-foreground">Mois</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium">Équipements</h4>
                  <div className="flex flex-wrap gap-1">
                    {parking.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {parking.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{parking.features.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium">Contact</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{parking.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{parking.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{parking.manager.name}</span>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium">Horaires</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Lun-Ven:</span>
                      <span>{parking.openingHours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend:</span>
                      <span>{parking.openingHours.saturday}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Créé le {formatDate(parking.createdAt)}
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredParkings.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun parking trouvé pour le filtre sélectionné.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
