import { Button } from "@/components/ui/button";
import heroImage from "@/assets/bookstore-hero.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Discover Your Next
          <br />
          Great Read
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Independent bookstore serving our community with carefully curated selections
          and a warm, welcoming atmosphere since 1987.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            onClick={() => scrollToSection("featured")}
          >
            Shop Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => scrollToSection("contact")}
          >
            Visit Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
