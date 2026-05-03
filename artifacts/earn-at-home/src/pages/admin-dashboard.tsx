import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAdminVerify,
  useListWorkers,
  useCreateWorker,
  useDeleteWorker,
  useAddPayment,
  useGetLeaderboard,
  useListWorkerPayments,
  useDeletePayment,
  useListBlogPosts,
  useCreateBlogPost,
  useDeleteBlogPost,
  useUpdateWorkerStats,
  getGetLeaderboardQueryKey,
  getListWorkersQueryKey,
  getListWorkerPaymentsQueryKey,
  getListBlogPostsQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { formatRupee } from "@/lib/utils";
import {
  Users, CreditCard, BarChart3, Trash2,
  RefreshCw, UserPlus, IndianRupee, Clock,
  BookOpen, Upload, Plus, Check
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";

const workerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  workerId: z.string().min(3, "Worker ID must be at least 3 characters"),
});

const paymentSchema = z.object({
  workerId: z.string().min(1, "Please select a worker"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(3, "Description required"),
});

const blogSchema = z.object({
  title: z.string().min(3, "Title required"),
  slug: z.string().min(3, "Slug required").regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  excerpt: z.string().min(10, "Excerpt required"),
  content: z.string().min(20, "Content required"),
  category: z.string().min(2, "Category required"),
  tags: z.string().optional(),
  published: z.boolean().default(false),
});

const statsSchema = z.object({
  workerId: z.string().min(1, "Please select a worker"),
  totalUploads: z.coerce.number().min(0),
  validCount: z.coerce.number().min(0),
  duplicateCount: z.coerce.number().min(0),
});

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeWorkerId, setActiveWorkerId] = useState<string>("");
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [pendingPayouts, setPendingPayouts] = useState<any[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [markingPaidWorkerId, setMarkingPaidWorkerId] = useState<number | null>(null);
  const [batchWorkerId, setBatchWorkerId] = useState("");
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  const { isError: isAuthError, isLoading: isAuthLoading } = useAdminVerify({ query: { retry: false } });

  useEffect(() => {
    if (isAuthError) {
      localStorage.removeItem("admin_token");
      setLocation("/admin");
      toast({ variant: "destructive", title: "Session Expired", description: "Please log in again." });
    }
  }, [isAuthError, setLocation, toast]);

  const { data: workers, isLoading: isWorkersLoading } = useListWorkers();
  const { data: stats, isLoading: isStatsLoading } = useGetLeaderboard();
  const { data: selectedWorkerPayments, isLoading: isPaymentsLoading } = useListWorkerPayments(
    parseInt(activeWorkerId),
    { query: { enabled: !!activeWorkerId } }
  );
  const { data: blogPosts, isLoading: isBlogLoading } = useListBlogPosts();

  const createWorker = useCreateWorker();
  const deleteWorker = useDeleteWorker();
  const addPayment = useAddPayment();
  const deletePayment = useDeletePayment();
  const createBlogPost = useCreateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const updateWorkerStats = useUpdateWorkerStats();

  const workerForm = useForm<z.infer<typeof workerSchema>>({
    resolver: zodResolver(workerSchema),
    defaultValues: { name: "", workerId: "" },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { workerId: "", amount: 0, description: "" },
  });

  const blogForm = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", slug: "", excerpt: "", content: "", category: "", tags: "", published: false },
  });

  const statsForm = useForm<z.infer<typeof statsSchema>>({
    resolver: zodResolver(statsSchema),
    defaultValues: { workerId: "", totalUploads: 0, validCount: 0, duplicateCount: 0 },
  });

  // Auto-slug from title
  const watchTitle = blogForm.watch("title");
  useEffect(() => {
    if (watchTitle) {
      blogForm.setValue(
        "slug",
        watchTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      );
    }
  }, [watchTitle]);

  const onWorkerSubmit = (values: z.infer<typeof workerSchema>) => {
    createWorker.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Worker created successfully" });
        setIsWorkerModalOpen(false);
        workerForm.reset();
        queryClient.invalidateQueries({ queryKey: getListWorkersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to create worker", description: err.data?.error || "Unknown error" });
      }
    });
  };

  const onPaymentSubmit = (values: z.infer<typeof paymentSchema>) => {
    addPayment.mutate({ id: parseInt(values.workerId), data: { amount: values.amount, description: values.description } }, {
      onSuccess: () => {
        toast({ title: "Payment recorded successfully" });
        paymentForm.reset({ ...values, amount: 0, description: "" });
        queryClient.invalidateQueries({ queryKey: getListWorkersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListWorkerPaymentsQueryKey(parseInt(values.workerId)) });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to record payment", description: err.data?.error || "Unknown error" });
      }
    });
  };

  const onBlogSubmit = (values: z.infer<typeof blogSchema>) => {
    createBlogPost.mutate({
      data: {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        published: values.published,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Blog post created" });
        setIsBlogModalOpen(false);
        blogForm.reset();
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to create blog post", description: err.data?.error || "Unknown error" });
      }
    });
  };

  const onStatsSubmit = (values: z.infer<typeof statsSchema>) => {
    updateWorkerStats.mutate({
      id: parseInt(values.workerId),
      data: {
        totalUploads: values.totalUploads,
        validCount: values.validCount,
        duplicateCount: values.duplicateCount,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Worker stats updated" });
        statsForm.reset({ workerId: values.workerId, totalUploads: 0, validCount: 0, duplicateCount: 0 });
        queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to update stats", description: err.data?.error || "Unknown error" });
      }
    });
  };

  const handleDeleteWorker = (id: number, name: string) => {
    if (confirm(`Delete ${name}? All their data will be lost.`)) {
      deleteWorker.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Worker deleted" });
          if (activeWorkerId === id.toString()) setActiveWorkerId("");
          queryClient.invalidateQueries({ queryKey: getListWorkersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
        }
      });
    }
  };

  const handleDeletePayment = (paymentId: number) => {
    if (!activeWorkerId) return;
    if (confirm("Delete this payment? This will reduce the worker's balance.")) {
      deletePayment.mutate({ id: parseInt(activeWorkerId), paymentId }, {
        onSuccess: () => {
          toast({ title: "Payment deleted" });
          queryClient.invalidateQueries({ queryKey: getListWorkersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListWorkerPaymentsQueryKey(parseInt(activeWorkerId)) });
        }
      });
    }
  };

  const handleDeleteBlogPost = (slug: string, title: string) => {
    if (confirm(`Delete blog post "${title}"?`)) {
      deleteBlogPost.mutate({ slug }, {
        onSuccess: () => {
          toast({ title: "Blog post deleted" });
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        }
      });
    }
  };

  const getApiBase = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
    return base + "/api";
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}`,
  });

  const fetchPendingPayouts = async () => {
    setIsPendingLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/admin/pending-payouts`, { headers: getAuthHeaders() });
      const data = await res.json();
      setPendingPayouts(Array.isArray(data) ? data : []);
    } catch {
      toast({ variant: "destructive", title: "Failed to load pending payouts" });
    } finally {
      setIsPendingLoading(false);
    }
  };

  const markAsPaid = async (workerId: number, paymentIds: number[], paymentMethod: string) => {
    setMarkingPaidWorkerId(workerId);
    try {
      const res = await fetch(`${getApiBase()}/admin/payments/bulk-mark-paid`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIds, paymentMethod }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ title: `Marked as paid via ${paymentMethod}` });
      setPendingPayouts((prev) => prev.filter((p) => p.workerId !== workerId));
      queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
    } catch {
      toast({ variant: "destructive", title: "Failed to mark as paid" });
    } finally {
      setMarkingPaidWorkerId(null);
    }
  };

  const handleBatchUpload = async () => {
    if (!batchWorkerId || !batchFile) {
      toast({ variant: "destructive", title: "Please select a worker and a ZIP file" });
      return;
    }
    setIsBatchUploading(true);
    setBatchResult(null);
    try {
      const form = new FormData();
      form.append("workerId", batchWorkerId);
      form.append("file", batchFile);
      const res = await fetch(`${getApiBase()}/admin/batch-upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setBatchResult(data);
      toast({ title: `Batch processed: ${data.uniqueCount} unique screenshots found` });
      queryClient.invalidateQueries({ queryKey: getGetLeaderboardQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListWorkersQueryKey() });
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || "Upload failed" });
    } finally {
      setIsBatchUploading(false);
    }
  };

  if (isAuthLoading) {
    return <Layout><div className="flex justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  }

  if (isAuthError) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#1a2744" }}>Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">Manage workers, payments, blog posts, and upload stats.</p>
          </div>
          <Dialog open={isWorkerModalOpen} onOpenChange={setIsWorkerModalOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-worker">
                <UserPlus className="mr-2 h-4 w-4" /> New Worker
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Worker</DialogTitle>
                <DialogDescription>Register a new worker and start tracking their earnings.</DialogDescription>
              </DialogHeader>
              <Form {...workerForm}>
                <form onSubmit={workerForm.handleSubmit(onWorkerSubmit)} className="space-y-4">
                  <FormField control={workerForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Priya Sharma" {...field} data-testid="input-worker-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={workerForm.control} name="workerId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Worker ID (Unique)</FormLabel>
                      <FormControl><Input placeholder="e.g. WRK006" {...field} data-testid="input-worker-id" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsWorkerModalOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createWorker.isPending} data-testid="button-submit-worker">
                      {createWorker.isPending ? "Creating..." : "Create Worker"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto mb-8 bg-muted/50 p-1">
            <TabsTrigger value="stats"><BarChart3 className="mr-1.5 h-4 w-4" /> Overview</TabsTrigger>
            <TabsTrigger value="workers" data-testid="tab-workers"><Users className="mr-1.5 h-4 w-4" /> Workers</TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments"><CreditCard className="mr-1.5 h-4 w-4" /> Payments</TabsTrigger>
            <TabsTrigger value="pending-payouts" data-testid="tab-pending-payouts"><Clock className="mr-1.5 h-4 w-4" /> Pending Payouts</TabsTrigger>
            <TabsTrigger value="blog" data-testid="tab-blog"><BookOpen className="mr-1.5 h-4 w-4" /> Blog</TabsTrigger>
            <TabsTrigger value="upload-stats" data-testid="tab-upload-stats"><Upload className="mr-1.5 h-4 w-4" /> Upload Stats</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-t-4 border-t-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Workers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "#1a2744" }}>
                    {isStatsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalWorkers.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-t-4" style={{ borderTopColor: "#c9a227" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Disbursed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "#1a2744" }}>
                    {isStatsLoading ? <Skeleton className="h-8 w-32" /> : formatRupee(stats?.totalPaid || 0)}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-green-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Screenshots Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: "#1a2744" }}>
                    {isStatsLoading ? <Skeleton className="h-8 w-20" /> : (stats?.screenshotsProcessed ?? 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" /> Recent Activity
                </CardTitle>
                <CardDescription>The 10 most recent payment records across all workers</CardDescription>
              </CardHeader>
              <CardContent>
                {isStatsLoading ? (
                  <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
                ) : stats?.recentPayments && stats.recentPayments.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentPayments.map(payment => {
                      const worker = workers?.find(w => w.id === payment.workerId);
                      return (
                        <div key={payment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className="text-sm font-medium">
                              {worker?.name || `Worker #${payment.workerId}`}{" "}
                              <span className="text-muted-foreground font-normal">— {payment.description}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{format(new Date(payment.createdAt), "MMM d, h:mm a")}</p>
                          </div>
                          <div className="font-bold text-sm text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                            +{formatRupee(payment.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No recent activity.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WORKERS TAB */}
          <TabsContent value="workers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Worker Directory</CardTitle>
                <CardDescription>Manage all registered workers.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Worker</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="w-[80px] text-center">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isWorkersLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                          </TableRow>
                        ))
                      : workers && workers.length > 0
                      ? workers.map((worker) => (
                          <TableRow key={worker.id} data-testid={`row-admin-worker-${worker.id}`}>
                            <TableCell className="font-medium">{worker.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{worker.workerId}</TableCell>
                            <TableCell className="text-right font-semibold text-green-700">{formatRupee(worker.balance)}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost" size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteWorker(worker.id, worker.name)}
                                disabled={deleteWorker.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No workers registered yet.</TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PAYMENTS TAB */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-12">
              <Card className="md:col-span-5 h-fit">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg">Record Payment</CardTitle>
                  <CardDescription>Add an approved payout to a worker's balance.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                      <FormField control={paymentForm.control} name="workerId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Worker</FormLabel>
                          <Select onValueChange={(val) => { field.onChange(val); setActiveWorkerId(val); }} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-worker-payment">
                                <SelectValue placeholder="Choose a worker..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workers?.map(w => (
                                <SelectItem key={w.id} value={w.id.toString()}>{w.name} ({w.workerId})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={paymentForm.control} name="amount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (Rs)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="number" step="0.01" className="pl-9 font-mono" placeholder="0.00" {...field} data-testid="input-payment-amount" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={paymentForm.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description / Batch ID</FormLabel>
                          <FormControl><Input placeholder="e.g. Batch 42 Image Tagging" {...field} data-testid="input-payment-desc" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full" disabled={addPayment.isPending} data-testid="button-submit-payment">
                        {addPayment.isPending ? "Processing..." : "Submit Payment"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="md:col-span-7">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg">Payment History</CardTitle>
                  <CardDescription>
                    {activeWorkerId
                      ? <span>Showing: <strong>{workers?.find(w => w.id.toString() === activeWorkerId)?.name}</strong></span>
                      : "Select a worker from the form."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {!activeWorkerId ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                      <CreditCard className="h-12 w-12 mb-3 opacity-20" />
                      <p>Select a worker to view payment history</p>
                    </div>
                  ) : isPaymentsLoading ? (
                    <div className="p-6 space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}</div>
                  ) : selectedWorkerPayments && selectedWorkerPayments.length > 0 ? (
                    <div className="divide-y">
                      {selectedWorkerPayments.map(payment => (
                        <div key={payment.id} className="p-4 flex items-center justify-between hover:bg-muted/20">
                          <div>
                            <div className="font-medium">{payment.description}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(payment.createdAt), "MMM d, yyyy h:mm a")}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="font-bold text-green-700">+{formatRupee(payment.amount)}</div>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeletePayment(payment.id)}
                              disabled={deletePayment.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">No payments recorded yet.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* BLOG TAB */}
          <TabsContent value="blog" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: "#1a2744" }}>Blog Posts</h2>
                <p className="text-sm text-muted-foreground">Manage published and draft articles.</p>
              </div>
              <Dialog open={isBlogModalOpen} onOpenChange={setIsBlogModalOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-post">
                    <Plus className="mr-2 h-4 w-4" /> New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>New Blog Post</DialogTitle>
                    <DialogDescription>Create a new article for the Resource Center.</DialogDescription>
                  </DialogHeader>
                  <Form {...blogForm}>
                    <form onSubmit={blogForm.handleSubmit(onBlogSubmit)} className="space-y-4">
                      <FormField control={blogForm.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl><Input placeholder="Article title" {...field} data-testid="input-blog-title" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={blogForm.control} name="slug" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL)</FormLabel>
                          <FormControl><Input placeholder="auto-generated-from-title" {...field} data-testid="input-blog-slug" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={blogForm.control} name="category" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl><Input placeholder="e.g. Tips & Guides" {...field} data-testid="input-blog-category" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={blogForm.control} name="tags" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (comma-separated)</FormLabel>
                          <FormControl><Input placeholder="e.g. earnings, tips, verification" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={blogForm.control} name="excerpt" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl><Textarea rows={2} placeholder="Short summary shown in listings" {...field} data-testid="input-blog-excerpt" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={blogForm.control} name="content" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content (HTML)</FormLabel>
                          <FormControl><Textarea rows={8} placeholder="<p>Article content here...</p>" {...field} data-testid="input-blog-content" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={blogForm.control} name="published" render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-blog-published" />
                          </FormControl>
                          <FormLabel className="!mt-0">Publish immediately</FormLabel>
                        </FormItem>
                      )} />
                      <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsBlogModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={createBlogPost.isPending} data-testid="button-submit-post">
                          {createBlogPost.isPending ? "Creating..." : "Create Post"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center w-[80px]">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isBlogLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            {[1, 2, 3, 4, 5].map(j => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                          </TableRow>
                        ))
                      : blogPosts && blogPosts.length > 0
                      ? blogPosts.map((post) => (
                          <TableRow key={post.slug} data-testid={`row-blog-${post.slug}`}>
                            <TableCell className="font-medium max-w-48 truncate">{post.title}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                            </TableCell>
                            <TableCell>
                              {post.published
                                ? <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><Check className="h-3.5 w-3.5" />Published</span>
                                : <span className="text-xs text-muted-foreground">Draft</span>}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost" size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteBlogPost(post.slug, post.title)}
                                disabled={deleteBlogPost.isPending}
                                data-testid={`button-delete-blog-${post.slug}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No blog posts yet. Create the first one.</TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PENDING PAYOUTS TAB */}
          <TabsContent value="pending-payouts" className="space-y-6">
            <Card>
              <CardHeader className="border-b bg-muted/20 flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Pending Payouts
                  </CardTitle>
                  <CardDescription>
                    Payments that have been recorded but not yet disbursed via EasyPaisa or JazzCash.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPendingPayouts}
                  disabled={isPendingLoading}
                  data-testid="button-refresh-pending"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isPendingLoading ? "animate-spin" : ""}`} />
                  {isPendingLoading ? "Loading..." : "Refresh"}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {pendingPayouts.length === 0 && !isPendingLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-sm">No pending payouts</p>
                    <p className="text-xs mt-1">Click Refresh to load pending payouts.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Worker</TableHead>
                        <TableHead>Total Due</TableHead>
                        <TableHead>Batches</TableHead>
                        <TableHead>Latest</TableHead>
                        <TableHead className="text-center">Mark as Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isPendingLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                              {[1, 2, 3, 4, 5].map((j) => (
                                <TableCell key={j}><Skeleton className="h-5" /></TableCell>
                              ))}
                            </TableRow>
                          ))
                        : pendingPayouts.map((p) => (
                            <TableRow key={p.workerId}>
                              <TableCell>
                                <div className="font-medium text-sm">{p.workerName}</div>
                                <div className="text-xs font-mono text-muted-foreground">{p.workerPublicId}</div>
                              </TableCell>
                              <TableCell className="font-bold text-green-700 text-sm">
                                {formatRupee(p.totalAmount)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {p.batchCount} {p.batchCount === 1 ? "batch" : "batches"}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(new Date(p.latestDate), "MMM d, h:mm a")}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1.5 justify-center">
                                  {["EasyPaisa", "JazzCash", "Bank"].map((method) => (
                                    <Button
                                      key={method}
                                      size="sm"
                                      variant="outline"
                                      className="text-xs h-7 px-2"
                                      disabled={markingPaidWorkerId === p.workerId}
                                      onClick={() => markAsPaid(p.workerId, p.paymentIds, method)}
                                      data-testid={`button-mark-paid-${method.toLowerCase()}-${p.workerId}`}
                                    >
                                      {markingPaidWorkerId === p.workerId ? (
                                        <RefreshCw className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <>
                                          <Check className="h-3 w-3 mr-1" />
                                          {method}
                                        </>
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* UPLOAD STATS TAB */}
          <TabsContent value="upload-stats" className="space-y-6">
            {/* ZIP BATCH UPLOAD */}
            <Card className="border-t-4" style={{ borderTopColor: "#c9a227" }}>
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" style={{ color: "#c9a227" }} />
                  Auto-Checker: ZIP Batch Upload
                </CardTitle>
                <CardDescription>
                  Upload a worker's ZIP file — everything is fully automatic. The system detects duplicates,
                  calculates Rs. 5 × unique screenshots, adds the payment to the worker's balance,
                  and queues it as a pending payout. No manual steps required.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Worker</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={batchWorkerId}
                      onChange={(e) => setBatchWorkerId(e.target.value)}
                      data-testid="select-batch-worker"
                    >
                      <option value="">Choose a worker...</option>
                      {workers?.map((w) => (
                        <option key={w.id} value={w.id.toString()}>{w.name} ({w.workerId})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload ZIP File</label>
                    <input
                      type="file"
                      accept=".zip"
                      className="w-full h-10 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground"
                      onChange={(e) => setBatchFile(e.target.files?.[0] ?? null)}
                      data-testid="input-batch-zip"
                    />
                  </div>
                </div>
                <Button
                  className="mt-4"
                  onClick={handleBatchUpload}
                  disabled={isBatchUploading || !batchWorkerId || !batchFile}
                  data-testid="button-process-batch"
                >
                  {isBatchUploading ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" /> Process ZIP Batch</>
                  )}
                </Button>

                {batchResult && (
                  <div
                    className="mt-5 rounded-xl border overflow-hidden"
                    data-testid="batch-result"
                  >
                    {/* Success Banner */}
                    <div
                      className="px-5 py-4 flex items-start gap-3"
                      style={{ backgroundColor: batchResult.payableAmount > 0 ? "#16a34a" : "#d97706" }}
                    >
                      <Check className="h-5 w-5 text-white shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-white">
                          {batchResult.payableAmount > 0
                            ? `Auto-processed for ${batchResult.workerName}`
                            : `No payable screenshots — ${batchResult.workerName}`}
                        </div>
                        <div className="text-xs text-white/80 mt-0.5">
                          {batchResult.message}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div
                      className="p-5"
                      style={{ backgroundColor: "rgba(201,162,39,0.05)" }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
                        {[
                          { label: "Total Images", value: batchResult.totalImages.toLocaleString(), color: "#1a2744" },
                          { label: "Unique (Valid)", value: batchResult.uniqueCount.toLocaleString(), color: "#16a34a" },
                          { label: "Duplicates", value: batchResult.duplicateCount.toLocaleString(), color: "#d97706" },
                          { label: "Auto-Added", value: formatRupee(batchResult.payableAmount), color: "#1a2744" },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="bg-white rounded-lg p-3 border">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                            <div className="font-bold text-lg" style={{ color }}>{value}</div>
                          </div>
                        ))}
                      </div>

                      {batchResult.payableAmount > 0 && (
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5" />
                              Stats updated · Balance increased by {formatRupee(batchResult.payableAmount)} · Pending payout created
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Go to "Pending Payouts" tab to mark payment as sent via EasyPaisa or JazzCash.
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 text-xs"
                            onClick={() => {
                              const tab = document.querySelector('[data-testid="tab-pending-payouts"]') as HTMLElement;
                              tab?.click();
                              setTimeout(fetchPendingPayouts, 100);
                            }}
                          >
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            View Pending Payouts
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-12">
              <Card className="md:col-span-5 h-fit">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg">Update Worker Stats</CardTitle>
                  <CardDescription>Set total uploads, valid count, and duplicate count for a worker.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...statsForm}>
                    <form onSubmit={statsForm.handleSubmit(onStatsSubmit)} className="space-y-4">
                      <FormField control={statsForm.control} name="workerId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Worker</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-worker-stats">
                                <SelectValue placeholder="Choose a worker..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workers?.map(w => (
                                <SelectItem key={w.id} value={w.id.toString()}>{w.name} ({w.workerId})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={statsForm.control} name="totalUploads" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Uploads</FormLabel>
                          <FormControl><Input type="number" min={0} {...field} data-testid="input-total-uploads" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={statsForm.control} name="validCount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valid Count</FormLabel>
                          <FormControl><Input type="number" min={0} {...field} data-testid="input-valid-count" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={statsForm.control} name="duplicateCount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duplicate Count</FormLabel>
                          <FormControl><Input type="number" min={0} {...field} data-testid="input-duplicate-count" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <p className="text-xs text-muted-foreground">
                        Payable amount is calculated automatically at Rs 5 per valid screenshot.
                      </p>
                      <Button type="submit" className="w-full" disabled={updateWorkerStats.isPending} data-testid="button-submit-stats">
                        {updateWorkerStats.isPending ? "Updating..." : "Update Stats"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="md:col-span-7">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg">Current Stats Summary</CardTitle>
                  <CardDescription>Upload stats for all workers. Rs 5 per valid screenshot.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Worker</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right text-green-700">Valid</TableHead>
                        <TableHead className="text-right text-orange-600">Dupes</TableHead>
                        <TableHead className="text-right">Payable</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isWorkersLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i}>{[1, 2, 3, 4, 5].map(j => <TableCell key={j}><Skeleton className="h-5" /></TableCell>)}</TableRow>
                          ))
                        : workers?.map((worker) => {
                            const w = worker as any;
                            const validCount = w.validCount ?? 0;
                            const payable = validCount * 5;
                            return (
                              <TableRow key={worker.id}>
                                <TableCell>
                                  <div className="font-medium">{worker.name}</div>
                                  <div className="text-xs font-mono text-muted-foreground">{worker.workerId}</div>
                                </TableCell>
                                <TableCell className="text-right text-sm">{(w.totalUploads ?? 0).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-sm font-medium text-green-700">{validCount.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-sm text-orange-600">{(w.duplicateCount ?? 0).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-sm" style={{ color: "#1a2744" }}>{formatRupee(payable)}</TableCell>
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
