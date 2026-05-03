import { useState } from "react";
import { Link } from "wouter";
import {
  Search, Trophy, ArrowRight, CheckCircle, XCircle, AlertCircle,
  Upload, IndianRupee, Clock, ChevronRight
} from "lucide-react";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupee } from "@/lib/utils";
import { useGetLeaderboard, useSearchWorkers } from "@workspace/api-client-react";

export default function LeaderboardPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useGetLeaderboard();
  const { data: results, isLoading: isLoadingSearch } = useSearchWorkers(
    { q: submitted },
    { query: { enabled: submitted.length > 0 } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(query.trim());
  };

  return (
    <Layout>
      {/* Header */}
      <div className="py-10 border-b" style={{ backgroundColor: "#1a2744" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Badge
            className="mb-4 text-xs font-semibold uppercase tracking-widest border px-3 py-1"
            style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", borderColor: "rgba(201,162,39,0.3)" }}
          >
            Public Verification Portal
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Worker Leaderboard
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            All worker stats are verified and updated in real time. Search by your Worker
            ID or name to see your detailed breakdown.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* SEARCH */}
        <section>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your Worker ID or Name..."
                className="pl-9 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="input-worker-search"
              />
            </div>
            <Button type="submit" className="h-12 px-6" data-testid="button-worker-search">
              Search
            </Button>
            {submitted && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => { setQuery(""); setSubmitted(""); }}
              >
                Clear
              </Button>
            )}
          </form>
        </section>

        {/* SEARCH RESULTS */}
        {submitted && (
          <section>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#1a2744" }}>
              Results for "{submitted}"
            </h2>
            {isLoadingSearch ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-36 w-full rounded-2xl" />
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-5">
                {results.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-white border rounded-2xl p-6 shadow-sm"
                    data-testid={`card-worker-${worker.id}`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-xl font-bold" style={{ color: "#1a2744" }}>
                          {worker.name}
                        </div>
                        <div className="text-sm font-mono text-muted-foreground mt-0.5">
                          Worker ID: {worker.workerId}
                        </div>
                      </div>
                      <Link href={`/worker/${worker.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          Full Profile <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      <div className="rounded-xl border p-3 text-center" style={{ backgroundColor: "#f8f9fc" }}>
                        <Upload className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Uploads</div>
                        <div className="text-xl font-bold mt-0.5" style={{ color: "#1a2744" }}>
                          {((worker as any).totalUploads ?? 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-xl border p-3 text-center bg-green-50 border-green-100">
                        <CheckCircle className="h-4 w-4 mx-auto mb-1 text-green-600" />
                        <div className="text-xs font-semibold uppercase tracking-wider text-green-700">Valid</div>
                        <div className="text-xl font-bold mt-0.5 text-green-700">
                          {((worker as any).validCount ?? 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-xl border p-3 text-center bg-orange-50 border-orange-100">
                        <XCircle className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                        <div className="text-xs font-semibold uppercase tracking-wider text-orange-600">Duplicates</div>
                        <div className="text-xl font-bold mt-0.5 text-orange-600">
                          {((worker as any).duplicateCount ?? 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="rounded-xl border p-3 text-center" style={{ backgroundColor: "rgba(201,162,39,0.08)", borderColor: "rgba(201,162,39,0.3)" }}>
                        <IndianRupee className="h-4 w-4 mx-auto mb-1" style={{ color: "#c9a227" }} />
                        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#c9a227" }}>Payable</div>
                        <div className="text-xl font-bold mt-0.5" style={{ color: "#1a2744" }}>
                          {formatRupee((worker as any).payableAmount ?? 0)}
                        </div>
                      </div>
                    </div>

                    {/* Payment history preview */}
                    {(worker as any).payments && (worker as any).payments.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          Recent Payments
                        </h3>
                        <div className="divide-y border rounded-xl overflow-hidden">
                          {(worker as any).payments.slice(0, 5).map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between px-4 py-3 bg-white">
                              <div>
                                <div className="text-sm font-medium text-foreground">{p.description}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {new Date(p.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                              <div className="font-bold text-green-700 text-sm">
                                +{formatRupee(p.amount)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 border rounded-2xl bg-muted/20 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-semibold">No workers found for "{submitted}"</p>
                <p className="text-sm mt-1">Try searching with your exact Worker ID</p>
              </div>
            )}
          </section>
        )}

        {/* FULL LEADERBOARD TABLE */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="h-5 w-5" style={{ color: "#c9a227" }} />
            <h2 className="text-xl font-bold" style={{ color: "#1a2744" }}>
              Full Rankings
            </h2>
          </div>
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <div
              className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b"
              style={{ backgroundColor: "#f8f9fc" }}
            >
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Worker ID</div>
              <div className="col-span-2 text-right">Uploads</div>
              <div className="col-span-2 text-right">Valid</div>
              <div className="col-span-2 text-right">Balance</div>
            </div>
            <div className="divide-y">
              {isLoadingLeaderboard
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="px-6 py-4">
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))
                : leaderboard?.topWorkers.map((worker, index) => (
                    <Link href={`/worker/${worker.id}`} key={worker.id}>
                      <div
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors cursor-pointer group"
                        data-testid={`row-lb-${worker.id}`}
                      >
                        <div className="col-span-1 flex justify-center">
                          <div
                            className={`w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                : index === 1
                                ? "bg-gray-100 text-gray-600 border border-gray-300"
                                : index === 2
                                ? "bg-orange-100 text-orange-700 border border-orange-300"
                                : "text-muted-foreground text-xs"
                            }`}
                          >
                            {worker.rank}
                          </div>
                        </div>
                        <div className="col-span-3 font-semibold group-hover:text-primary transition-colors" style={{ color: "#1a2744" }}>
                          {worker.name}
                        </div>
                        <div className="col-span-2 text-xs font-mono text-muted-foreground">
                          {worker.workerId}
                        </div>
                        <div className="col-span-2 text-right text-sm text-muted-foreground">
                          {((worker as any).screenshotsProcessed ?? "—")}
                        </div>
                        <div className="col-span-2 text-right text-sm text-green-700 font-medium">
                          —
                        </div>
                        <div className="col-span-2 text-right font-bold text-green-700">
                          {formatRupee(worker.balance)}
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
