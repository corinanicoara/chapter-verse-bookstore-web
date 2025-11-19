import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookHeart, TrendingUp, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalSignups: number;
  popularBooks: { title: string; count: number }[];
  savedBooksCount: number;
}

interface BrandAnalytics {
  poetic: {
    views: number;
    heroClicks: number;
    preOrders: number;
    contacts: number;
    conversionRate: number;
  };
  modern: {
    views: number;
    heroClicks: number;
    preOrders: number;
    contacts: number;
    conversionRate: number;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [brandAnalytics, setBrandAnalytics] = useState<BrandAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view the dashboard",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Wait for role check to complete
    if (roleLoading) return;

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [user, isAdmin, roleLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get total pre-orders
      const { count: preOrderCount, error: preOrderError } = await supabase
        .from("pre_orders")
        .select("*", { count: "exact", head: true });

      if (preOrderError) {
        console.error("Error fetching pre-orders:", preOrderError);
        // Don't throw - just use 0 if table doesn't exist yet
      }

      // Get popular books from pre-orders
      const { data: preOrders, error: booksError } = await supabase
        .from("pre_orders")
        .select("book_title");

      if (booksError) {
        console.error("Error fetching books:", booksError);
      }

      // Count book occurrences
      const bookCounts = preOrders?.reduce((acc: Record<string, number>, order) => {
        const title = order.book_title;
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      }, {}) || {};

      const popularBooks = Object.entries(bookCounts)
        .map(([title, count]) => ({ title, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get saved books count
      const { count: savedCount, error: savedError } = await supabase
        .from("saved_books")
        .select("*", { count: "exact", head: true });

      if (savedError) {
        console.error("Error fetching saved books:", savedError);
      }

      setStats({
        totalSignups: preOrderCount || 0,
        popularBooks,
        savedBooksCount: savedCount || 0,
      });

      // Fetch brand analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("analytics_events")
        .select("event_type, brand_variant");

      if (analyticsError) {
        console.error("Error fetching analytics:", analyticsError);
      }

      // Calculate analytics per brand
      const poeticEvents = analyticsData?.filter(e => e.brand_variant === 'poetic') || [];
      const modernEvents = analyticsData?.filter(e => e.brand_variant === 'modern') || [];

      const calculateMetrics = (events: any[]) => {
        const sessions = new Set(events.map(() => Math.random())).size; // Simplified session count
        const heroClicks = events.filter(e => 
          e.event_type === 'hero_shop_click' || e.event_type === 'hero_visit_click'
        ).length;
        const preOrders = events.filter(e => e.event_type === 'pre_order_submission').length;
        const contacts = events.filter(e => e.event_type === 'contact_submission').length;
        const conversions = preOrders + contacts;
        const conversionRate = heroClicks > 0 ? (conversions / heroClicks) * 100 : 0;

        return {
          views: sessions,
          heroClicks,
          preOrders,
          contacts,
          conversionRate: Math.round(conversionRate * 10) / 10,
        };
      };

      setBrandAnalytics({
        poetic: calculateMetrics(poeticEvents),
        modern: calculateMetrics(modernEvents),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Track your bookstore's performance and customer engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pre-Orders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSignups || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Customers reserved books
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Books</CardTitle>
                <BookHeart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.savedBooksCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Books added to wishlists
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popular Titles</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.popularBooks.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Unique books pre-ordered
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Most Popular Pre-Orders</CardTitle>
              <CardDescription>Books with the highest number of reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.popularBooks && stats.popularBooks.length > 0 ? (
                <div className="space-y-4">
                  {stats.popularBooks.map((book, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{book.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{book.count}</p>
                        <p className="text-xs text-muted-foreground">pre-orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No pre-orders yet. Start promoting your upcoming releases!
                </p>
              )}
            </CardContent>
          </Card>

          {brandAnalytics && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>A/B Test Results: Brand Performance</CardTitle>
                <CardDescription>Compare how "Chapter & Verse" (Poetic) vs "Verso" (Modern) performs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Chapter & Verse</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Poetic</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Hero Button Clicks</span>
                        <span className="font-semibold">{brandAnalytics.poetic.heroClicks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pre-orders</span>
                        <span className="font-semibold">{brandAnalytics.poetic.preOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Contact Submissions</span>
                        <span className="font-semibold">{brandAnalytics.poetic.contacts}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="text-sm font-medium">Conversion Rate</span>
                        <span className="font-bold text-primary">{brandAnalytics.poetic.conversionRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Verso</h3>
                      <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">Modern</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Hero Button Clicks</span>
                        <span className="font-semibold">{brandAnalytics.modern.heroClicks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pre-orders</span>
                        <span className="font-semibold">{brandAnalytics.modern.preOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Contact Submissions</span>
                        <span className="font-semibold">{brandAnalytics.modern.contacts}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="text-sm font-medium">Conversion Rate</span>
                        <span className="font-bold text-primary">{brandAnalytics.modern.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Winner:</strong> {brandAnalytics.poetic.conversionRate > brandAnalytics.modern.conversionRate 
                      ? `"Chapter & Verse" (Poetic) is performing ${(brandAnalytics.poetic.conversionRate - brandAnalytics.modern.conversionRate).toFixed(1)}% better`
                      : brandAnalytics.modern.conversionRate > brandAnalytics.poetic.conversionRate
                      ? `"Verso" (Modern) is performing ${(brandAnalytics.modern.conversionRate - brandAnalytics.poetic.conversionRate).toFixed(1)}% better`
                      : "Both variants are performing equally"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
