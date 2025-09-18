import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Phone, FileText } from "lucide-react"

export function SupportContent() {
  const tickets = [
    {
      id: "#12345",
      subject: "Login issues with mobile app",
      status: "Open",
      priority: "High",
      created: "2 hours ago",
    },
    {
      id: "#12344",
      subject: "Billing question about subscription",
      status: "In Progress",
      priority: "Medium",
      created: "1 day ago",
    },
    {
      id: "#12343",
      subject: "Feature request for dashboard",
      status: "Resolved",
      priority: "Low",
      created: "3 days ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Support</h1>
        <p className="text-muted-foreground text-pretty">Get help and support for your account and services.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Choose how you'd like to get in touch with our support team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <MessageCircle className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Get instant help</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <Mail className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@example.com</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                <Phone className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
            <CardDescription>Submit a detailed support request for complex issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select className="w-full p-2 border border-input rounded-md bg-background">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your issue..."
                rows={4}
              />
            </div>
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
          <CardDescription>Track the status of your recent support requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge
                      variant={
                        ticket.status === "Open"
                          ? "destructive"
                          : ticket.status === "In Progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline">{ticket.priority}</Badge>
                  </div>
                  <p className="text-sm">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">Created {ticket.created}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
