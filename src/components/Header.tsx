import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Chapter & Verse</h1>
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
          <Button variant="default">Visit Us</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
