import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Trash2, Plus, ArrowLeft } from "lucide-react";

export const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const validOptions = options.filter((opt) => opt.trim());
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    if (validOptions.length < 2) {
      toast.error("Please add at least two options");
      return;
    }

    setSubmitting(true);
    try {
      const poll = await api.createPoll({
        question: question.trim(),
        options: validOptions,
      });
      toast.success("Poll created successfully!");
      navigate(`/poll/${poll.id}`);
    } catch (error) {
      toast.error("Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Poll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={submitting}
            >
              Create Poll
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}; 