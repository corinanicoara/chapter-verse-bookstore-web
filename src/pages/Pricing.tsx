import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Monthly PDF Digest",
    price: 5,
    description: "Perfect for light readers",
    features: [
      "Monthly curated book summaries",
      "PDF format for easy reading",
      "Key insights and takeaways",
      "Email delivery"
    ]
  },
  {
    name: "Curated Book Box",
    price: 19,
    description: "For dedicated book lovers",
    features: [
      "1 carefully selected book per month",
      "Exclusive reading notes",
      "Author insights & context",
      "Free shipping",
      "Digital companion guide"
    ],
    highlighted: true
  },
  {
    name: "Premium Coaching Bundle",
    price: 49,
    description: "Ultimate reading experience",
    features: [
      "Monthly book bundle (2-3 books)",
      "Personal coaching session",
      "Exclusive community access",
      "Priority support",
      "Custom reading roadmap",
      "All lower tier benefits"
    ]
  }
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleSelectTier = async (tier: PricingTier) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to select a subscription tier.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(tier.name);

    try {
      const { error } = await supabase
        .from("subscription_selections")
        .insert({
          user_id: user.id,
          tier_name: tier.name,
          price_monthly: tier.price
        });

      if (error) throw error;

      toast({
        title: "Selection Saved!",
        description: `You've selected the ${tier.name} tier ($${tier.price}/month).`
      });

      // Optionally navigate to dashboard or confirmation page
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      console.error("Error saving selection:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save your selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Business Book Box Subscription
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to accelerate your business knowledge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.name}
              className={`relative flex flex-col ${
                tier.highlighted 
                  ? "border-primary shadow-lg scale-105" 
                  : "border-border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleSelectTier(tier)}
                  disabled={isSubmitting !== null}
                >
                  {isSubmitting === tier.name ? "Saving..." : "Choose This"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All plans include a 30-day money-back guarantee</p>
          <p className="mt-2">Cancel or change your subscription anytime</p>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
