import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { ArrowLeft, Vote, AlertCircle, XCircle, ChartBar } from "lucide-react";
import type { Poll } from "@/lib/types";

export const PollDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      try {
        const data = await api.getPoll(id);
        setPoll(data);
        const hasVoted = storage.hasVotedOnPoll(id);
        setVoted(hasVoted);
        if (hasVoted) {
          // Find the option with the highest votes when the user last voted
          const maxVotesOption = data.options.reduce((prev, current) => 
            (prev.votes > current.votes) ? prev : current
          );
          setSelectedOption(maxVotesOption.id);
        }
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
    if (!id || voting) return;
    setVoting(true);
    try {
      const updatedPoll = await api.vote(id, optionId);
      setPoll(updatedPoll);
      setVoted(true);
      setSelectedOption(optionId);
      storage.addVotedPoll(id);
      toast.success("Vote recorded successfully!");
    } catch (error) {
      toast.error("Failed to vote");
    } finally {
      setVoting(false);
    }
  };

  const handleRemoveVote = async () => {
    if (!id || !selectedOption || voting) return;
    setVoting(true);
    try {
      const updatedPoll = await api.removeVote(id, selectedOption);
      setPoll(updatedPoll);
      setVoted(false);
      setSelectedOption(null);
      storage.removeVotedPoll(id);
      toast.success("Vote removed successfully!");
    } catch (error) {
      toast.error("Failed to remove vote");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full opacity-50"
          disabled
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="border border-muted/40">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 rounded-full group"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </Button>

      <Card className="border border-muted/40">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {poll.question}
          </CardTitle>
          {voted && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>You have already voted on this poll</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                onClick={handleRemoveVote}
                disabled={voting}
              >
                <XCircle className="h-4 w-4" />
                Remove Vote
              </Button>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ChartBar className="h-4 w-4" />
              <span>{poll.options.length} options</span>
            </div>
            <span>•</span>
            <span>{totalVotes} total votes</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {poll.options.map((option) => {
            const percentage = totalVotes
              ? Math.round((option.votes / totalVotes) * 100)
              : 0;
            const isSelectedOption = option.id === selectedOption;

            return (
              <div key={option.id} className="space-y-3 group">
                <Button
                  variant={isSelectedOption ? "default" : "outline"}
                  className={`w-full justify-between h-12 rounded-lg transition-all duration-200
                    ${isSelectedOption ? "border-2 border-primary shadow-sm" : "hover:border-primary/20"}
                    ${!voted && !voting ? "hover:scale-[1.01]" : ""}`}
                  onClick={() => handleVote(option.id)}
                  disabled={voting || voted}
                >
                  <div className="flex items-center gap-2">
                    {isSelectedOption && <Vote className="h-4 w-4 text-primary-foreground" />}
                    <span>{option.text}</span>
                  </div>
                  {voted && (
                    <span className={`text-sm font-medium ${
                      isSelectedOption ? "text-primary-foreground" : "text-muted-foreground"
                    }`}>
                      {percentage}%
                    </span>
                  )}
                </Button>
                {voted && (
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isSelectedOption ? "bg-primary" : "bg-primary/20"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground px-1">
                      <span>{option.votes} votes</span>
                    
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