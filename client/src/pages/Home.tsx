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

  if (loading) {
    return (
      <div className="grid gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ChartBar className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">No polls yet</h3>
            <p className="text-muted-foreground">Create your first poll to get started</p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/create" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Poll
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {polls.map((poll) => (
        <Link key={poll.id} to={`/poll/${poll.id}`}>
          <Card className="group border border-muted/40 hover:border-primary/20 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
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
      ))}
    </div>
  );
}; 