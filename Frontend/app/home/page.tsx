"use client";

import { useState, useEffect, CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  PenLine,
  EyeOff,
  LogIn,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/header";
import {
  JournalSidebar,
  type JournalEntry,
} from "@/components/journal-sidebar";
import { JournalEditor } from "@/components/journal-editor";
import { RecommendationsPanel } from "@/components/recommendations-panel";
import type { EmotionKey } from "@/components/emotion-badge";
import axios from "axios";
import { JournalEntryContext } from "@/components/context/journalContext";
import { toast, Toaster } from "sonner";
import { UserContext } from "@/components/context/authContext";
import { SongContext } from "@/components/context/songContext";
import instance from "@/config/axiosConfig";
interface MusicRecommendation {
  title: string;
  artist: string;
  url: string;
}
import { ClipLoader, DotLoader, RotateLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export default function SoulLog() {
  let { entries, setEntries, getEntries } = useContext(JournalEntryContext);
  let { data, setUser, getUser, isloggedIn } = useContext(UserContext);
  const { song, setSong } = useContext(SongContext);
  const [loggedIn, setLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">(
    isloggedIn ? "dashboard" : "landing"
  );
  const [myEntries, setMyEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInMode, setSignInMode] = useState<"regular" | "anonymous">(
    "regular"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [musicRecommendation, setMusicRecommendation] =
    useState<MusicRecommendation>({ title: "", artist: "", url: "" });

  useEffect(() => {
    if (entries.length > 0) {
      setMyEntries(entries);
    }
  }, [entries]);

  useEffect(() => {
    isloggedIn ? setCurrentView("dashboard") : setCurrentView("landing");
  }, [isloggedIn]);

  useEffect(() => {
    if (!isloggedIn) {
      setCurrentView("landing");
    }
  }, [isloggedIn]);

  const handleSaveEntry = async (
    content: string,
    emotion: EmotionKey,
    aiReview: string,
    isAnonymous: boolean
  ) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content,
      emotion,
      aiReview,
      timestamp: Date.now(),
      userId: data?.id,
    };
    toast("Handling Entry Save", {
      description: "Saving your journal entry...",

      position: "top-center",
      duration: 10000,
      type: "info",
    });
    setSelectedEntry(null);

    let postData = await instance.post("journal/post", newEntry);
    console.log(JSON.stringify(postData?.data.entryData.aiReview));

    setEntries([
      {
        ...postData?.data?.entryData,
        aiReview: postData?.data?.entryData?.aiReview,
        emotion: postData?.data?.entryData?.emotion,
      },
      ...entries,
    ]);
    setMyEntries([
      {
        ...postData?.data?.entryData,
        aiReview: postData?.data?.entryData?.aiReview,
        emotion: postData?.data?.entryData?.emotion,
      },
      ...myEntries,
    ]);
    newEntry.aiReview = postData?.data?.entryData.aiReview;
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    console.log("Journal Entries after adding new entry:");
    console.log(updatedEntries);

    // cm
    console.log(song);
    console.log("New Entry Saved:");
    setSong([...postData?.data?.song, ...song]);
    console.log("Songs Recommendation:");
    console.log(song);

    if (postData?.data?.song) {
      toast("Journal Saved!", {
        description: "Your journal entry has been saved successfully.",

        position: "top-center",
        duration: 4000,
        type: "success",
      });
    }
    setSelectedEntry(newEntry);
    setMusicRecommendation(postData?.data?.song);
  };

  const handleNewJournal = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Past Journals with streak tracker */}
        <aside className="w-80 border-r hidden lg:flex flex-col overflow-hidden">
          <JournalSidebar
            onNewJournal={handleNewJournal}
            onSelectEntry={setSelectedEntry}
            selectedEntryId={selectedEntry?.id}
            data={entries}
          />
        </aside>

        {/* Middle Panel - Notebook with quote rotator at top */}
        <section className="flex-1 overflow-hidden flex flex-col">
          {selectedEntry ? (
            <div className="h-full overflow-y-auto scrollbar-thin">
              <div className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <Button
                  variant="ghost"
                  onClick={handleNewJournal}
                  className="mb-4 hover:bg-primary/10"
                >
                  ← Back to New Entry
                </Button>
                <Card className="paper-shadow border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-primary">
                        Journal Entry
                      </CardTitle>
                      <Badge className="bg-primary/10 text-primary border-primary/30 border">
                        {new Date(selectedEntry.timestamp).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-base leading-relaxed">
                      {selectedEntry.content}
                    </p>
                    <Card className="bg-primary/5 border-primary/20 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-primary mb-3 text-lg">
                              AI Review
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">
                              {selectedEntry.aiReview}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <JournalEditor onSave={handleSaveEntry} />
          )}
        </section>

        {/* Right Panel - Music (top, scrollable) + Mood Summary (bottom, fixed) */}
        <aside className="w-80 border-l hidden xl:flex flex-col overflow-hidden">
          <RecommendationsPanel />
        </aside>
      </main>
    </div>
  );
}
