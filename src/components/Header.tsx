import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { brandName } = useBrand();
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">{brandName}</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("featured")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Featured Books
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-foreground hover:text-primary transition-colors"
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </button>
          {user && (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </button>
          )}
          {user ? (
            <Button variant="default" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="default" onClick={() => navigate('/auth')} className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
