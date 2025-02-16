import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
          Votely
        </Link>
        <Button asChild size="sm" className="gap-2">
          <Link to="/create">
            <PlusCircle className="h-4 w-4" />
            New Poll
          </Link>
        </Button>
      </div>
    </header>
  );
}; 