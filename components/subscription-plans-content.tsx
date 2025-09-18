import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function SubscriptionPlansContent() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      period: "per month",
      description: "Perfect for individuals and small teams",
      features: ["Up to 5 users", "10GB storage", "Basic support", "Core features"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Best for growing businesses",
      features: ["Up to 25 users", "100GB storage", "Priority support", "Advanced features", "Analytics dashboard"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large organizations",
      features: [
        "Unlimited users",
        "1TB storage",
        "24/7 dedicated support",
        "All features",
        "Custom integrations",
        "Advanced security",
      ],
      popular: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Subscription Plans</h1>
        <p className="text-muted-foreground text-pretty">Choose the perfect plan for your business needs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? "border-primary" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan Status</CardTitle>
          <CardDescription>Manage your current subscription and billing information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pro Plan</p>
              <p className="text-sm text-muted-foreground">Active until March 15, 2024</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
