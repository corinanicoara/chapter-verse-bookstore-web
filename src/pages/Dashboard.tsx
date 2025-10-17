import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookHeart, TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalSignups: number;
  popularBooks: { title: string; count: number }[];
  savedBooksCount: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get total pre-orders
      const { count: preOrderCount, error: preOrderError } = await supabase
        .from("pre_orders")
        .select("*", { count: "exact", head: true });

      if (preOrderError) throw preOrderError;

      // Get popular books from pre-orders
      const { data: preOrders, error: booksError } = await supabase
        .from("pre_orders")
        .select("book_title");

      if (booksError) throw booksError;

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

      if (savedError) throw savedError;

      setStats({
        totalSignups: preOrderCount || 0,
        popularBooks,
        savedBooksCount: savedCount || 0,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
