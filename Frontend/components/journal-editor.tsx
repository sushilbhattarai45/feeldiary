"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save } from "lucide-react";
import { EmotionBadge, emotions, type EmotionKey } from "./emotion-badge";
import { motion } from "framer-motion";

interface JournalEditorProps {
  onSave: (
    content: string,
    emotion: EmotionKey,
    aiReview: string,
    isAnonymous: boolean
  ) => void;
}

export function JournalEditor({ onSave }: JournalEditorProps) {
  const [content, setContent] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<EmotionKey | null>(null);
  const [aiReview, setAiReview] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEmotion = () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const contentLower = content.toLowerCase();
      let detectedEmotion: EmotionKey = "neutral";
      let review = "";

      if (
        contentLower.includes("happy") ||
        contentLower.includes("great") ||
        contentLower.includes("amazing") ||
        contentLower.includes("wonderful") ||
        contentLower.includes("joy")
      ) {
        detectedEmotion = "happy";
        review =
          "It's beautiful to see you experiencing joy! These positive moments are precious. Keep embracing the good feelings and let them energize you.";
      } else if (
        contentLower.includes("sad") ||
        contentLower.includes("down") ||
        contentLower.includes("depressed") ||
        contentLower.includes("lonely")
      ) {
        detectedEmotion = "sad";
        review =
          "I sense you're going through a difficult time. It's okay to feel sad - your emotions are valid. Remember, this feeling is temporary, and brighter days are ahead.";
      } else if (
        contentLower.includes("angry") ||
        contentLower.includes("frustrated") ||
        contentLower.includes("mad") ||
        contentLower.includes("annoyed")
      ) {
        detectedEmotion = "angry";
        review =
          "Your frustration is understandable. It's healthy to acknowledge these feelings. Take some deep breaths and remember that you have the power to respond thoughtfully.";
      } else if (
        contentLower.includes("anxious") ||
        contentLower.includes("worried") ||
        contentLower.includes("nervous") ||
        contentLower.includes("overwhelmed") ||
        contentLower.includes("stress")
      ) {
        detectedEmotion = "anxious";
        review =
          "I can feel the weight of your worries. Anxiety can be challenging, but you're not alone. Try to focus on what you can control and take things one moment at a time.";
      } else if (
        contentLower.includes("excited") ||
        contentLower.includes("thrilled") ||
        contentLower.includes("can't wait") ||
        contentLower.includes("looking forward")
      ) {
        detectedEmotion = "excited";
        review =
          "Your excitement is contagious! It's wonderful to see you looking forward to something. Embrace this positive energy and let it fuel your enthusiasm.";
      } else if (
        contentLower.includes("calm") ||
        contentLower.includes("peaceful") ||
        contentLower.includes("relaxed") ||
        contentLower.includes("serene")
      ) {
        detectedEmotion = "calm";
        review =
          "What a lovely state of mind to be in. This sense of calm is a gift - savor it and let it restore your energy.";
      } else {
        review =
          "Thank you for sharing your thoughts. Every entry is a step toward better self-understanding. Keep reflecting and growing.";
      }

      setCurrentEmotion(detectedEmotion);
      setAiReview(review);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(content, "mixed", aiReview, false);
    setContent("");
    setCurrentEmotion(null);
    setAiReview("");
  };

  return (
    <div
      style={{
        height: "87%",
      }}
      className="h-full mt-2 flex flex-col bg-white"
    >
      <div className="px-6 py-2 bg-white border-b flex-shrink-0">
        <h2 className="text-lg font-semibold text-foreground mb-0">
          Today's Journal
        </h2>
        <p className="text-muted-foreground text-xs">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 max-w-4xl mx-auto p-6 w-full flex flex-col min-h-0">
          <Card className="shadow-sm border bg-white flex-1 flex flex-col min-h-0">
            <CardContent className="p-6 flex-1 flex flex-col min-h-0">
              <div className="relative flex-1 min-h-0 mb-4">
                <Textarea
                  placeholder="Dear Diary, today I feel..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full text-base leading-7 resize-none border-0 bg-white notebook-lines focus-visible:ring-0 focus-visible:ring-offset-0 font-sans overflow-y-auto"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(transparent, transparent 27px, #e5e7eb 27px, #e5e7eb 28px)",
                    backgroundPosition: "0 0.25rem",
                    lineHeight: "28px",
                  }}
                />
              </div>

              <div className="flex-shrink-0 space-y-3">
                <div className="flex gap-2">
                  {/* <Button
                    onClick={analyzeEmotion}
                    disabled={!content.trim() || isAnalyzing}
                    className="bg-primary hover:bg-primary/90 text-white font-medium"
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
                        <Sparkles className="mr-2 h-4 w-4" />
Check your journal                      </>
                    )}
                  </Button> */}

                  {/* {currentEmotion && ( */}
                  <Button
                    onClick={handleSave}
                    className="bg-foreground hover:bg-foreground/90 text-white font-medium"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Entry
                  </Button>
                  {/* )} */}
                </div>

                {currentEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border">
                      <span className="text-4xl">
                        {emotions[currentEmotion].emoji}
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          Detected Emotion
                        </p>
                        <EmotionBadge emotion={currentEmotion} />
                      </div>
                    </div>

                    <Card className="bg-primary/5 border-primary/20 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground mb-2 text-sm">
                              AI Empathetic Response
                            </p>
                            <p className="text-xs text-foreground/80 leading-relaxed">
                              {aiReview}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {currentEmotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={handleSave}
            size="lg"
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl hover:shadow-primary/50 transition-all"
          >
            <Save className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
