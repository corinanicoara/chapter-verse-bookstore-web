import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";

const books = [
  {
    id: 1,
    title: "The Art of Memory",
    author: "Elena Rodriguez",
    description: "A profound exploration of how memories shape our identity and the stories we tell ourselves.",
    image: book1,
  },
  {
    id: 2,
    title: "Whispers in the Dark",
    author: "Marcus Chen",
    description: "A gripping mystery that unravels the secrets of a small coastal town one revelation at a time.",
    image: book2,
  },
  {
    id: 3,
    title: "Garden of Tomorrow",
    author: "Sophie Laurent",
    description: "A heartwarming story about second chances, healing, and finding love in unexpected places.",
    image: book3,
  },
];

const FeaturedBooks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedBooks, setSavedBooks] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      loadSavedBooks();
    }
  }, [user]);

  const loadSavedBooks = async () => {
    if (!user) return;

    const { data, error } = await supabase.from("saved_books").select("book_id").eq("user_id", user.id);

    if (!error && data) {
      setSavedBooks(data.map((item) => item.book_id));
    }
  };

  const handleSaveBook = async (bookId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save books",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const isSaved = savedBooks.includes(bookId);

    if (isSaved) {
      const { error } = await supabase.from("saved_books").delete().eq("user_id", user.id).eq("book_id", bookId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to remove book",
          variant: "destructive",
        });
      } else {
        setSavedBooks(savedBooks.filter((id) => id !== bookId));
        toast({
          title: "Removed",
          description: "Book removed from your saved list",
        });
      }
    } else {
      const { error } = await supabase.from("saved_books").insert({ user_id: user.id, book_id: bookId });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save book",
          variant: "destructive",
        });
      } else {
        setSavedBooks([...savedBooks, bookId]);
        toast({
          title: "Saved!",
          description: "Book added to your saved list",
        });
      }
    }
  };

  return (
    <section id="featured" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Featured This Month</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked selections from our passionate book lovers, each one a journey waiting to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book, index) => (
            <Card
              key={book.id}
              className="overflow-hidden hover-scale cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-foreground">{book.title}</h3>
                <p className="text-accent font-medium mb-3">{book.author}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{book.description}</p>
                <Button
                  variant={savedBooks.includes(book.id) ? "default" : "outline"}
                  className="w-full gap-2"
                  onClick={() => handleSaveBook(book.id)}
                >
                  <Heart className={`h-4 w-4 ${savedBooks.includes(book.id) ? "fill-current" : ""}`} />
                  {savedBooks.includes(book.id) ? "Saved" : "Save Book"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <PreOrderForm />
    </section>
  );
};

export default FeaturedBooks;
