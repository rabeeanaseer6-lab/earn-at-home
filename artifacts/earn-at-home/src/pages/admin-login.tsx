import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useAdminLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        if (data.success && data.token) {
          localStorage.setItem("admin_token", data.token);
          toast({
            title: "Login Successful",
            description: "Welcome to the admin dashboard.",
          });
          setLocation("/admin/dashboard");
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid credentials.",
          });
        }
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid password or network error.",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Secure access for employer management</p>
        </div>

        <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Enter the administrator password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            className="pl-10" 
                            placeholder="••••••••" 
                            {...field} 
                            data-testid="input-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? "Verifying..." : "Access Dashboard"}
                  {!loginMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 bg-muted/20 text-xs text-muted-foreground">
            This area is restricted to authorized personnel only.
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
