import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import WorkerProfile from "@/pages/worker";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import LeaderboardPage from "@/pages/leaderboard";
import CalculatorPage from "@/pages/calculator";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import HelpPage from "@/pages/help";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import DisclaimerPage from "@/pages/disclaimer";
import TrainingPage from "@/pages/training";
import AboutPage from "@/pages/about";
import AboutUsPage from "@/pages/about-us";

import "@/lib/utils"; // ensure auth token getter is registered

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/worker/:id" component={WorkerProfile} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/calculator" component={CalculatorPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/help" component={HelpPage} />
      <Route path="/training" component={TrainingPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/disclaimer" component={DisclaimerPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
