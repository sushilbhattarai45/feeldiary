"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Sparkles, PenLine, TrendingUp, Users, EyeOff, LogIn, UserPlus } from "lucide-react"
import Navbar from "@/components/ui/navbar"

import axios from "axios"
// Emotion types
const emotions = {
  happy: { emoji: "😊", color: "bg-yellow-500", label: "Happy" },
  sad: { emoji: "😔", color: "bg-blue-500", label: "Sad" },
  angry: { emoji: "😡", color: "bg-red-500", label: "Angry" },
  anxious: { emoji: "😰", color: "bg-purple-500", label: "Anxious" },
  excited: { emoji: "🤩", color: "bg-pink-500", label: "Excited" },
  calm: { emoji: "😌", color: "bg-green-500", label: "Calm" },
  neutral: { emoji: "😐", color: "bg-gray-500", label: "Neutral" },
}

type EmotionKey = keyof typeof emotions

interface JournalEntry {
  id: string
  content: string
  emotion: EmotionKey
  aiReview: string
  timestamp: number
  author: string
  likes: number
  isAnonymous?: boolean
}

// Dummy data for community feed
const dummyFeedEntries: JournalEntry[] = [
  {
    id: "feed1",
    content:
      "Today was amazing! I finally finished my project and got great feedback from my team. Feeling so accomplished and grateful.",
    emotion: "happy",
    aiReview:
      "It's wonderful to see you celebrating your achievements! Your hard work has paid off, and this sense of accomplishment is well-deserved. Keep nurturing this positive momentum.",
    timestamp: Date.now() - 3600000,
    author: "Sarah M.",
    likes: 24,
    isAnonymous: false,
  },
  {
    id: "feed2",
    content:
      "Feeling a bit overwhelmed with everything on my plate. Work deadlines, family commitments... it's a lot to juggle.",
    emotion: "anxious",
    aiReview:
      "I hear you - juggling multiple responsibilities can feel overwhelming. Remember to take things one step at a time and don't hesitate to ask for support when you need it. You're doing your best.",
    timestamp: Date.now() - 7200000,
    author: "Alex K.",
    likes: 18,
    isAnonymous: true,
  },
  {
    id: "feed3",
    content: "Just got back from a peaceful walk in the park. The fresh air and nature really helped clear my mind.",
    emotion: "calm",
    aiReview:
      "Nature has a beautiful way of bringing us back to center. It's great that you're taking time for self-care and finding moments of peace in your day.",
    timestamp: Date.now() - 10800000,
    author: "Jordan L.",
    likes: 31,
    isAnonymous: false,
  },
  {
    id: "feed4",
    content:
      "I've been struggling with some personal issues lately. It's hard to talk about, but writing helps me process everything.",
    emotion: "sad",
    aiReview:
      "Thank you for trusting this space with your feelings. Writing can be incredibly therapeutic. Remember, it's okay to not be okay, and reaching out for support is a sign of strength.",
    timestamp: Date.now() - 14400000,
    author: "Anonymous",
    likes: 42,
    isAnonymous: true,
  },
  {
    id: "feed5",
    content:
      "Can't believe I got accepted into my dream program! All those late nights studying finally paid off. I'm so excited for this new chapter!",
    emotion: "excited",
    aiReview:
      "Congratulations! Your dedication and hard work have opened this incredible door. This excitement you're feeling is the fuel for your next adventure. Embrace it fully!",
    timestamp: Date.now() - 18000000,
    author: "Michael T.",
    likes: 56,
    isAnonymous: false,
  },
  {
    id: "feed6",
    content: "Had a disagreement with a close friend today. I know we'll work it out, but it still hurts right now.",
    emotion: "sad",
    aiReview:
      "Conflicts with people we care about can be particularly painful. It's healthy that you're acknowledging these feelings. Your awareness that you'll work through this shows maturity and hope.",
    timestamp: Date.now() - 21600000,
    author: "Anonymous",
    likes: 28,
    isAnonymous: true,
  },
  {
    id: "feed7",
    content:
      "Started my morning with meditation and yoga. Feeling centered and ready to take on whatever comes my way today.",
    emotion: "calm",
    aiReview:
      "What a wonderful way to start your day! This intentional self-care practice is setting you up for success. Your mind and body will thank you.",
    timestamp: Date.now() - 25200000,
    author: "Emma R.",
    likes: 35,
    isAnonymous: false,
  },
  {
    id: "feed8",
    content:
      "Why does everything have to be so difficult? I'm tired of constantly fighting uphill battles. Just need to vent.",
    emotion: "angry",
    aiReview:
      "Your frustration is completely valid. Sometimes we need to let these feelings out. Remember, it's okay to feel angry, and venting in a safe space like this is healthy. You're stronger than you know.",
    timestamp: Date.now() - 28800000,
    author: "Anonymous",
    likes: 47,
    isAnonymous: true,
  },
]

export default function FeelDiary() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing")
  const [activeTab, setActiveTab] = useState<"feed" | "myjournal" | "write">("feed")
  const [journalContent, setJournalContent] = useState("")
  const [currentEmotion, setCurrentEmotion] = useState<EmotionKey | null>(null)
  const [aiReview, setAiReview] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [myEntries, setMyEntries] = useState<JournalEntry[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [signInMode, setSignInMode] = useState<"regular" | "anonymous">("regular")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("feelDiaryEntries")
    if (stored) {
      setMyEntries(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (myEntries.length > 0) {
      localStorage.setItem("feelDiaryEntries", JSON.stringify(myEntries))
    }
  }, [myEntries])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const analyzeEmotion = () => {
    if (!journalContent.trim()) return

    setIsAnalyzing(true)

    setTimeout(() => {
      const content = journalContent.toLowerCase()
      let detectedEmotion: EmotionKey = "neutral"
      let review = ""

      if (
        content.includes("happy") ||
        content.includes("great") ||
        content.includes("amazing") ||
        content.includes("wonderful")
      ) {
        detectedEmotion = "happy"
        review =
          "It's beautiful to see you experiencing joy! These positive moments are precious. Keep embracing the good feelings and let them energize you."
      } else if (content.includes("sad") || content.includes("down") || content.includes("depressed")) {
        detectedEmotion = "sad"
        review =
          "I sense you're going through a difficult time. It's okay to feel sad - your emotions are valid. Remember, this feeling is temporary, and brighter days are ahead."
      } else if (content.includes("angry") || content.includes("frustrated") || content.includes("mad")) {
        detectedEmotion = "angry"
        review =
          "Your frustration is understandable. It's healthy to acknowledge these feelings. Take some deep breaths and remember that you have the power to respond thoughtfully."
      } else if (
        content.includes("anxious") ||
        content.includes("worried") ||
        content.includes("nervous") ||
        content.includes("overwhelmed")
      ) {
        detectedEmotion = "anxious"
        review =
          "I can feel the weight of your worries. Anxiety can be challenging, but you're not alone. Try to focus on what you can control and take things one moment at a time."
      } else if (content.includes("excited") || content.includes("thrilled") || content.includes("can't wait")) {
        detectedEmotion = "excited"
        review =
          "Your excitement is contagious! It's wonderful to see you looking forward to something. Embrace this positive energy and let it fuel your enthusiasm."
      } else if (content.includes("calm") || content.includes("peaceful") || content.includes("relaxed")) {
        detectedEmotion = "calm"
        review =
          "What a lovely state of mind to be in. This sense of calm is a gift - savor it and let it restore your energy."
      } else {
        review =
          "Thank you for sharing your thoughts. Every entry is a step toward better self-understanding. Keep reflecting and growing."
      }

      setCurrentEmotion(detectedEmotion)
      setAiReview(review)
      setIsAnalyzing(false)
    }, 1500)
  }

  const saveEntry = async() => {
    if (!journalContent.trim() || !currentEmotion) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: journalContent,
      emotion: currentEmotion,
      aiReview: aiReview,
      timestamp: Date.now(),
      author: isAnonymous ? "Anonymous" : "You",
      likes: 0,
      isAnonymous: isAnonymous,
    }

    setMyEntries([newEntry, ...myEntries])
    setJournalContent("")
    setCurrentEmotion(null)
    setAiReview("")
    setIsAnonymous(false)
    setActiveTab("myjournal")
  }

  const postJournal = async() => {
     const newEntry: JournalEntry = {
       id: Date.now().toString(),
       content: journalContent,
       emotion: currentEmotion || "neutral",
       aiReview: aiReview,
       timestamp: Date.now(),
       author: "You",
       likes: 0
     }
   try{
      await axios.post('http://localhost:5000/api/journal/post', newEntry)
      alert('Journal entry posted successfully!')
   }
    catch(error){ 
      alert('Failed to post journal entry. Please try again later.')
    }
    }


  const handleSignIn = () => {
    if (!username.trim() || !password.trim()) return

    // Store user info in localStorage
    localStorage.setItem("feelDiaryUser", JSON.stringify({ username, isAnonymous: signInMode === "anonymous" }))

    setIsAuthenticated(true)
    setCurrentView("dashboard")
    setShowSignIn(false)
    setUsername("")
    setPassword("")
  }

  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        {/* Navbar */}
      
      <Navbar />
      

        {/* Sign-in Modal */}
        {showSignIn && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to FeelDiary</CardTitle>
                <CardDescription>Choose how you'd like to sign in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={signInMode} onValueChange={(v) => setSignInMode(v as "regular" | "anonymous")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="regular" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Regular
                    </TabsTrigger>
                    <TabsTrigger value="anonymous" className="gap-2">
                      <EyeOff className="h-4 w-4" />
                      Anonymous
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="regular" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Sign in with your identity visible to the community</p>
                  </TabsContent>
                  <TabsContent value="anonymous" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="anon-username">Username</Label>
                      <Input
                        id="anon-username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="anon-password">Password</Label>
                      <Input
                        id="anon-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border-2 border-primary/20">
                      <div className="flex gap-3">
                        <EyeOff className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          Your identity will remain completely private. You can still track your personal journal, but
                          the community won't see your name.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSignIn(false)
                      setUsername("")
                      setPassword("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSignIn}
                    disabled={!username.trim() || !password.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium shadow-md">
                <Sparkles className="mr-2 h-4 w-4 inline" />
                AI-Powered Emotional Wellness
              </Badge>
              <h2 className="text-6xl md:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent leading-tight">
                Your Safe Space to Express & Reflect
              </h2>
              <p className="text-xl text-muted-foreground text-balance max-w-l mx-auto leading-relaxed">
                Join a supportive community where you can journal your thoughts, receive AI-powered emotional insights,
                and connect with others on their wellness journey. Share openly or anonymously.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setShowSignIn(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 hover:bg-muted transition-all bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Feature Cards */}
            <div id="features" className="grid md:grid-cols-3 gap-6 mt-20">
              <Card className="border-2 hover:border-primary hover:shadow-xl transition-all bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <PenLine className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">Express Yourself</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Write freely and let your emotions flow. Share publicly or anonymously in a safe, judgment-free
                    space.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-secondary hover:shadow-xl transition-all bg-gradient-to-br from-card to-secondary/5">
                <CardHeader className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-7 w-7 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl">AI Insights</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Receive empathetic, personalized feedback and emotion analysis powered by advanced AI technology.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-accent hover:shadow-xl transition-all bg-gradient-to-br from-card to-accent/5">
                <CardHeader className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">Community Support</CardTitle>
                  <CardDescription className="leading-relaxed">
                    Connect with a supportive community and discover you're not alone in your emotional journey.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Stats Section */}
            {/* <div className="grid grid-cols-3 gap-8 mt-20 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 shadow-lg">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground mt-2">Journal Entries</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-secondary">5K+</p>
                <p className="text-sm text-muted-foreground mt-2">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-accent">98%</p>
                <p className="text-sm text-muted-foreground mt-2">Positive Feedback</p>
              </div>
            </div> */}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-10 py-8 bg-card/50">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>FeelDiary © 2025 | Your private journaling space</p>
            <p className="mt-2">Made with care for your emotional wellness</p>
          </div>
        </footer>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              FeelDiary
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={activeTab === "feed" ? "default" : "ghost"}
              onClick={() => setActiveTab("feed")}
              className={activeTab === "feed" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"}
            >
              <Users className="mr-2 h-4 w-4" />
              Community
            </Button>
            <Button
              variant={activeTab === "write" ? "default" : "ghost"}
              onClick={() => setActiveTab("write")}
              className={activeTab === "write" ? "bg-secondary text-secondary-foreground shadow-md" : "hover:bg-muted"}
            >
              <PenLine className="mr-2 h-4 w-4" />
              Write
            </Button>
            <Button
              variant={activeTab === "myjournal" ? "default" : "ghost"}
              onClick={() => setActiveTab("myjournal")}
              className={activeTab === "myjournal" ? "bg-accent text-accent-foreground shadow-md" : "hover:bg-muted"}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              My Journal
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Community Feed */}
        {activeTab === "feed" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-foreground">Community Feed</h2>
                <p className="text-muted-foreground mt-2">Discover and connect with others' journeys</p>
              </div>
              <Badge variant="secondary" className="px-4 py-2 text-sm shadow-sm">
                <Users className="mr-2 h-4 w-4" />
                {dummyFeedEntries.length} entries
              </Badge>
            </div>

            {dummyFeedEntries.map((entry) => (
              <Card
                key={entry.id}
                className="border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-card to-muted/10"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {entry.isAnonymous ? (
                        <Avatar className="h-12 w-12 bg-gradient-to-br from-muted to-muted-foreground/30 border-2 shadow-md">
                          <AvatarFallback className="text-muted-foreground">
                            <EyeOff className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-12 w-12 bg-gradient-to-br from-primary via-accent to-secondary border-2 shadow-md">
                          <AvatarFallback className="text-primary-foreground font-semibold">
                            {entry.author[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{entry.author}</p>
                          {entry.isAnonymous && (
                            <Badge variant="outline" className="text-xs">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${emotions[entry.emotion].color} text-white border-0 shadow-md`}>
                      {emotions[entry.emotion].emoji} {emotions[entry.emotion].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed text-base">{entry.content}</p>
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border-l-4 border-primary shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-md">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary mb-1">AI Insight</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{entry.aiReview}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Heart className="mr-2 h-4 w-4" />
                      {entry.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-secondary">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Write Journal */}
        {activeTab === "write" && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-secondary shadow-xl bg-gradient-to-br from-card to-secondary/5">
              <CardHeader>
                <CardTitle className="text-3xl text-foreground">Write Your Journal Entry</CardTitle>
                <CardDescription className="text-base">
                  Express your thoughts and feelings freely. Share with the community or keep it private.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="How are you feeling today? Write about your thoughts, experiences, or anything on your mind..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="min-h-[250px] text-base leading-relaxed resize-none border-2 focus:border-secondary"
                />

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border-2">
                  <div className="flex items-center gap-3">
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor="anonymous-mode" className="text-sm font-semibold cursor-pointer">
                        Post Anonymously
                      </Label>
                      <p className="text-xs text-muted-foreground">Your identity will be hidden from the community</p>
                    </div>
                  </div>
                  <Switch id="anonymous-mode" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={analyzeEmotion}
                    disabled={!journalContent.trim() || isAnalyzing}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-pulse">Analyzing</span>
                        <span className="ml-2 flex gap-1">
                          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                            .
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
                            .
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                            .
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze Emotions
                      </>
                    )}
                  </Button>

                    <Button
                      onClick={saveEntry}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      size="lg"
                    >
                      Save Entry
                    </Button>
                
                    <Button
                      onClick={postJournal}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                      size="lg"
                    >
                      Post
                    </Button>
                
                </div>

                {currentEmotion && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-muted to-muted/50 border-2">
                      <span className="text-5xl">{emotions[currentEmotion].emoji}</span>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Detected Emotion</p>
                        <Badge className={`${emotions[currentEmotion].color} text-white border-0 shadow-md mt-1`}>
                          {emotions[currentEmotion].label}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/30 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-primary mb-2 text-lg">AI Empathetic Response</p>
                          <p className="text-foreground leading-relaxed">{aiReview}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Journal */}
        {activeTab === "myjournal" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-foreground">My Journal Entries</h2>
                <p className="text-muted-foreground mt-2">Track your emotional journey over time</p>
              </div>
              <Badge variant="secondary" className="px-4 py-2 text-sm shadow-sm">
                {myEntries.length} {myEntries.length === 1 ? "entry" : "entries"}
              </Badge>
            </div>

            {myEntries.length === 0 ? (
              <Card className="border-2 border-dashed shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center mx-auto mb-6">
                    <PenLine className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No journal entries yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start writing to track your emotional journey and receive AI insights!
                  </p>
                  <Button
                    onClick={() => setActiveTab("write")}
                    className="bg-secondary text-secondary-foreground shadow-md"
                    size="lg"
                  >
                    <PenLine className="mr-2 h-5 w-5" />
                    Write Your First Entry
                  </Button>
                </CardContent>
              </Card>
            ) : (
              myEntries.map((entry) => (
                <Card
                  key={entry.id}
                  className="border-2 hover:border-accent/50 hover:shadow-lg transition-all bg-gradient-to-br from-card to-accent/5"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {entry.isAnonymous ? (
                          <Avatar className="h-12 w-12 bg-gradient-to-br from-muted to-muted-foreground/20 border-2">
                            <AvatarFallback className="text-muted-foreground">
                              <EyeOff className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-12 w-12 bg-gradient-to-br from-accent to-primary border-2">
                            <AvatarFallback className="text-accent-foreground font-semibold">Y</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              {entry.isAnonymous ? "Posted Anonymously" : "You"}
                            </p>
                            {entry.isAnonymous && (
                              <Badge variant="outline" className="text-xs">
                                <EyeOff className="mr-1 h-3 w-3" />
                                Anonymous
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                            {new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${emotions[entry.emotion].color} text-white border-0 shadow-md`}>
                        {emotions[entry.emotion].emoji} {emotions[entry.emotion].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed text-base">{entry.content}</p>
                    <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl p-4 border-l-4 border-accent shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-accent mb-1">AI Review</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{entry.aiReview}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
