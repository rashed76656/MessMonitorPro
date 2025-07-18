import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, User, Mail, Lock, Phone, Users, Key, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  role: z.enum(['admin', 'border'], { required_error: 'Please select a role' }),
  adminSecret: z.string().optional(),
}).refine((data) => {
  if (data.role === 'admin' && !data.adminSecret) {
    return false;
  }
  return true;
}, {
  message: "Admin secret key is required for admin registration",
  path: ["adminSecret"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onShowLogin: () => void;
}

export const RegisterForm = ({ onShowLogin }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: undefined,
      adminSecret: '',
    },
  });

  const watchRole = form.watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await register(data);
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please login.",
      });
      onShowLogin();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700">
      <div className="max-w-md w-full mx-4">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <UserPlus className="text-primary text-4xl" />
            </div>
            <CardTitle className="font-inter font-bold text-3xl text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600">
              Join Mess Monitor today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Full Name"
                            className="pl-3 pr-10 py-3"
                            {...field}
                          />
                          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
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
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="Email address"
                            className="pl-3 pr-10 py-3"
                            {...field}
                          />
                          <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Password"
                            className="pl-3 pr-10 py-3"
                            {...field}
                          />
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="tel"
                            placeholder="Phone Number"
                            className="pl-3 pr-10 py-3"
                            {...field}
                          />
                          <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="py-3">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="border">Mess Border</SelectItem>
                              <SelectItem value="admin">Mess Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Users className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchRole === 'admin' && (
                  <FormField
                    control={form.control}
                    name="adminSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="password"
                              placeholder="Admin Secret Key"
                              className="pl-3 pr-10 py-3"
                              {...field}
                            />
                            <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          </div>
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          Admin registration requires a secret key
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button 
                  type="submit" 
                  className="w-full py-3 bg-secondary hover:bg-green-700" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>

                <div className="text-center">
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={onShowLogin}
                    className="text-primary hover:text-blue-700 text-sm"
                  >
                    Already have an account? Sign in here
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
