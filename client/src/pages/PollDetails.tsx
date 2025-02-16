import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ArrowLeft, Vote } from "lucide-react";
import type { Poll } from "@/lib/types";

export const PollDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      try {
        const data = await api.getPoll(id);
        setPoll(data);
      } catch (error) {
        toast.error("Failed to fetch poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
    const interval = setInterval(fetchPoll, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleVote = async (optionId: string) => {
    if (!id || voted) return;
    setVoting(true);
    try {
      const updatedPoll = await api.vote(id, optionId);
      setPoll(updatedPoll);
      setVoted(true);
      toast.success("Vote recorded successfully!");
    } catch (error) {
      toast.error("Failed to vote");
    } finally {
      setVoting(false);
    }
  };

  const totalVotes = poll?.options.reduce((sum, opt) => sum + opt.votes, 0) || 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Skeleton className="h-8 w-24" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="mb-8 gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="border border-muted/40">
        <CardHeader>
          <CardTitle className="text-2xl">{poll.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {poll.options.map((option) => {
            const percentage = totalVotes
              ? Math.round((option.votes / totalVotes) * 100)
              : 0;

            return (
              <div key={option.id} className="space-y-2">
                <Button
                  variant={voted ? "outline" : "default"}
                  className="w-full justify-between h-12 gap-2"
                  onClick={() => handleVote(option.id)}
                  disabled={voting || voted}
                >
                  <span>{option.text}</span>
                  {voted && <span className="text-muted-foreground">{percentage}%</span>}
                </Button>
                {voted && (
                  <div className="space-y-1">
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{option.votes} votes</span>
                      <span>{totalVotes} total votes</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}; 