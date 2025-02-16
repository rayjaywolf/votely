import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold "
        >
          Votely
        </Link>
        <Button asChild size="sm" className="gap-2 rounded-full">
          <Link to="/create">
            <PlusCircle className="h-4 w-4" />
            New Poll
          </Link>
        </Button>
      </div>
    </header>
  );
}; 