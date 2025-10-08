import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Visit Us Today
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Come browse our shelves, enjoy a cup of coffee, and discover your next favorite book.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="opacity-90">
                42 Literary Lane
                <br />
                Readington, MA 02134
              </p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
              <Clock className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="opacity-90">
                Mon-Sat: 9am - 8pm
                <br />
                Sunday: 10am - 6pm
              </p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
              <Phone className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="opacity-90">(555) 123-4567</p>
            </div>
            
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
              <Mail className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="opacity-90">hello@chapterandverse.com</p>
            </div>
          </div>
          
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            Get Directions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
