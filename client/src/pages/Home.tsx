import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Poll } from "@/lib/types";
import { ChartBar, Plus } from "lucide-react";

export const Home = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await api.getPolls();
        setPolls(data);
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Latest Polls</h1>
          <p className="text-muted-foreground mt-1">
            Browse and vote on active polls
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link to="/create">
            <Plus className="h-5 w-5" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border border-muted/40">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
        ) : (
          polls.map((poll) => (
            <Link key={poll.id} to={`/poll/${poll.id}`}>
              <Card className="group border border-muted/40 hover:border-primary/20 hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">
                    {poll.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <ChartBar className="h-4 w-4" />
                      <span>{poll.options.length} options</span>
                    </div>
                    <span>•</span>
                    <span>
                      {poll.options.reduce((sum, opt) => sum + opt.votes, 0)} votes
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}; 