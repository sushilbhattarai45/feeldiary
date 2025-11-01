import React,{useState} from "react";
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react";

const Navbar = () => {
    return(
      <nav className="border-b bg-card/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                FeelDiary
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <Button
                // onClick={() => setShowSignIn(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

    )
}

export default Navbar

