"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle, Clock, Filter, RefreshCw, MapPin, User, Phone, Mail, CreditCard, Building, Eye, FileText } from 'lucide-react'
import { ParkingRequest } from '@/lib/types'
import { ApiService } from '@/lib/api'

export function WilayaParkingRequestsContent() {
  const [requests, setRequests] = useState<ParkingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all')
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ParkingRequest | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getParkingRequests()
      if (response.success) {
        setRequests(response.data)
      } else {
        setError(response.message || 'Failed to fetch parking requests')
      }
    } catch (err) {
      setError('An error occurred while fetching parking requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected' | 'in_review') => {
    try {
      setProcessing(requestId)
      const response = await ApiService.updateParkingRequestStatus(requestId, status, reviewNotes)
      if (response.success) {
        setRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { 
                ...request, 
                status, 
                reviewNotes: reviewNotes || request.reviewNotes,
                updatedAt: new Date().toISOString() 
              }
            : request
        ))
        setSelectedRequest(null)
        setReviewNotes('')
      } else {
        setError(response.message || 'Failed to update request status')
      }
    } catch (err) {
      setError('An error occurred while updating request status')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: ParkingRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'in_review':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: ParkingRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_review':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityColor = (priority: ParkingRequest['priority']) => {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredRequests = requests.filter(request => {
    if (statusFilter === 'all') return true
    return request.status === statusFilter
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demandes d'Ouverture de Parking</h1>
            <p className="text-muted-foreground">Gérer les demandes d'ouverture de nouveaux parkings</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Demandes d'Ouverture de Parking</h1>
            <p className="text-muted-foreground">Gérer les demandes d'ouverture de nouveaux parkings</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Demandes d'Ouverture de Parking</h1>
          <p className="text-muted-foreground">Gérer les demandes d'ouverture de nouveaux parkings</p>
        </div>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtrer par statut:</span>
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="in_review">En cours d'examen</SelectItem>
            <SelectItem value="approved">Approuvées</SelectItem>
            <SelectItem value="rejected">Rejetées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune demande trouvée pour le filtre sélectionné.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription>
                        Demande créée le {formatDate(request.createdAt)}
                        {request.updatedAt !== request.createdAt && (
                          <span> • Modifiée le {formatDate(request.updatedAt)}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {request.status === 'pending' ? 'En attente' :
                       request.status === 'in_review' ? 'En cours d\'examen' :
                       request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(request.priority)}>
                      {request.priority === 'low' ? 'Faible' :
                       request.priority === 'medium' ? 'Moyenne' :
                       request.priority === 'high' ? 'Élevée' : 'Urgente'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Requester Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Informations du demandeur
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.requester.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.requester.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.requester.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.requester.idCard}</span>
                      </div>
                      {request.requester.organization && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{request.requester.organization}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location and Project Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Informations du projet
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.location.address}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Places demandées:</span> {request.requestedSpaces}
                      </div>
                      {request.estimatedCost && (
                        <div className="text-sm">
                          <span className="font-medium">Coût estimé:</span> {formatCurrency(request.estimatedCost)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Description du projet
                  </h3>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                </div>

                {/* Documents */}
                {request.documents && Array.isArray(request.documents) && request.documents.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Documents joints
                    </h3>
                    <div className="flex space-x-2">
                      {request.documents.map((doc, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={doc} 
                            alt={`Document ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => window.open(doc, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                {request.reviewNotes && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Notes d'examen
                    </h3>
                    <p className="text-sm text-muted-foreground">{request.reviewNotes}</p>
                  </div>
                )}

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setSelectedRequest(request)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Examiner
                      </Button>
                    </div>
                  </div>
                )}

                {request.status === 'in_review' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setSelectedRequest(request)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Décider
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Examiner la demande</DialogTitle>
            <DialogDescription>
              {selectedRequest?.status === 'pending' 
                ? 'Examiner cette demande d\'ouverture de parking.'
                : 'Prendre une décision sur cette demande.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes d'examen</label>
              <Textarea
                placeholder="Ajoutez vos notes d'examen ou de décision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Annuler
            </Button>
            {selectedRequest?.status === 'pending' ? (
              <Button 
                onClick={() => selectedRequest && handleStatusUpdate(selectedRequest.id, 'in_review')}
                disabled={processing === selectedRequest?.id}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {processing === selectedRequest?.id ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Mettre en examen
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={() => selectedRequest && handleStatusUpdate(selectedRequest.id, 'approved')}
                  disabled={processing === selectedRequest?.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing === selectedRequest?.id ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Approuver
                </Button>
                <Button 
                  onClick={() => selectedRequest && handleStatusUpdate(selectedRequest.id, 'rejected')}
                  disabled={processing === selectedRequest?.id}
                  variant="destructive"
                >
                  {processing === selectedRequest?.id ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Rejeter
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
