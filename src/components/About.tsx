import { Heart, Users, BookMarked } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Community Focused",
    description: "More than a bookstore—we're a gathering place for book lovers, hosting events and fostering connections.",
  },
  {
    icon: Users,
    title: "Expert Recommendations",
    description: "Our knowledgeable staff loves sharing their passion for literature and helping you find your perfect read.",
  },
  {
    icon: BookMarked,
    title: "Curated Selection",
    description: "Every book in our store is chosen with care, from timeless classics to exciting new voices.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Chapter & Verse
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              For over three decades, Chapter & Verse has been a beloved cornerstone of our community.
              We believe in the power of stories to connect, inspire, and transform. Our carefully curated
              selection spans genres and generations, ensuring there's always something new to discover
              among our shelves.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're seeking the latest bestseller, a forgotten classic, or a thoughtful gift,
              our friendly staff is here to guide you on your literary journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
