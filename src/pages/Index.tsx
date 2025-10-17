import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedBooks from "@/components/FeaturedBooks";
import About from "@/components/About";
import PreOrderForm from "@/components/PreOrderForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedBooks />
        <About />
        <section id="pre-order" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Pre-Order Books</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reserve upcoming releases and be the first to get your hands on new titles.
              </p>
            </div>
            <PreOrderForm />
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
