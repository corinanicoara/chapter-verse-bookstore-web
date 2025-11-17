import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';
import { trackEvent } from '@/lib/analytics';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  book_title: z.string().trim().min(1, 'Book title is required').max(200, 'Book title must be less than 200 characters'),
});

type FormData = z.infer<typeof formSchema>;

const PreOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { brand } = useBrand();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      book_title: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('pre_orders')
        .insert([{ 
          name: data.name, 
          email: data.email,
          book_title: data.book_title
        }]);

      if (error) throw error;

      // Track successful pre-order
      await trackEvent({
        eventType: 'pre_order_submission',
        brandVariant: brand,
        metadata: { book_title: data.book_title }
      });

      toast({
        title: 'Pre-order Confirmed!',
        description: "We'll notify you when the book is released.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit your pre-order.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pre-Order a Book</CardTitle>
        <CardDescription>Reserve your copy before it's released</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="book_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reserve Book
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PreOrderForm;
