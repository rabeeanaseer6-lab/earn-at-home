import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupee } from "@/lib/utils";
import { useGetWorker, useListWorkerPayments } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, History, IndianRupee, Calendar, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkerProfile() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: worker, isLoading: isWorkerLoading, error: workerError } = useGetWorker(id, { 
    query: { enabled: !!id } 
  });
  
  const { data: payments, isLoading: isPaymentsLoading } = useListWorkerPayments(id, {
    query: { enabled: !!id }
  });

  if (workerError) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <div className="bg-destructive/10 text-destructive rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <UserCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Worker Not Found</h1>
          <p className="text-muted-foreground mb-6">The worker profile you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to home
          </Link>
        </div>

        {isWorkerLoading ? (
          <Card className="border-t-4 border-t-primary shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-48 mt-4" />
            </CardContent>
          </Card>
        ) : worker ? (
          <Card className="border-t-4 border-t-primary shadow-md overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
              <UserCircle className="w-64 h-64 -mt-16 -mr-16" />
            </div>
            <CardHeader className="pb-2 flex flex-col md:flex-row md:items-start md:justify-between gap-4 relative z-10">
              <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-3 text-primary">
                  {worker.name}
                </CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="font-mono bg-muted">ID: {worker.workerId}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    Joined {format(new Date(worker.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right bg-secondary/10 px-4 py-3 rounded-lg border border-secondary/20">
                <div className="text-sm font-semibold text-secondary-foreground/80 uppercase tracking-wider mb-1">Current Balance</div>
                <div className="text-3xl font-bold text-primary tracking-tight" data-testid="text-worker-balance">
                  {formatRupee(worker.balance)}
                </div>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5 text-primary" />
              Payment History
            </CardTitle>
            <CardDescription>Records of all approved payouts and earnings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isPaymentsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : payments && payments.length > 0 ? (
              <div className="divide-y">
                {payments.map(payment => (
                  <div key={payment.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors" data-testid={`row-payment-${payment.id}`}>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{payment.description}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(payment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                    <div className="font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-100 self-start sm:self-auto shadow-sm">
                      +{formatRupee(payment.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <div className="bg-muted rounded-full p-3 mb-3">
                  <IndianRupee className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <p className="font-medium text-foreground">No payments yet</p>
                <p className="text-sm mt-1">Earnings will appear here once processed by the employer.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
