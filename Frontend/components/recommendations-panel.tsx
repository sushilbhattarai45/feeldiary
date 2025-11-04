"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, TrendingUp, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const musicRecommendations = [
  {
    id: 1,
    title: "Golden Hour",
    artist: "JVKE",
    album: "this is what ____ feels like",
  },
  {
    id: 2,
    title: "Sunflower",
    artist: "Post Malone",
    album: "Spider-Man: Into the Spider-Verse",
  },
  {
    id: 3,
    title: "Let's Go Home Together",
    artist: "Ella Henderson",
    album: "Everything I Didn't Say",
  },
  {
    id: 4,
    title: "Good Days",
    artist: "SZA",
    album: "Good Days",
  },
  {
    id: 5,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
  },
]

export function RecommendationsPanel() {
  return (
    <div className="h-full mt-2 bg-white flex flex-col">
      <div className="h-[100%] border-b overflow-hidden flex flex-col">
        <div className="p-3 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-semibold uppercase tracking-wider">Mood Playlist</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
          {musicRecommendations.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="bg-white border hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
                <CardContent className="p-2.5">
                  <div className="flex items-start gap-2.5 mb-1.5">
                    <div className="h-9 w-9 rounded-lg bg-chart-3 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Music className="h-4 w-4 text-white " />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate mb-0.5">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.album}</p>
                    </div>
                   <p className="text-xs text-muted-foreground truncate">{track.artist}</p>

                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 h-8 bg-primary/10 hover:bg-primary/20 text-primary border-0 text-xs"
                  >
                    <Play className="h-4 w-3 mr-1 " />
                    Play
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* <div className="h-[20%] flex flex-col p-3 overflow-hidden">
        <div className="flex items-center gap-2 mb-2 flex-shrink-0">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Mood Summary</h3>
        </div>
        <Card className="bg-white border shadow-sm flex-shrink-0">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardTitle className="text-xs font-semibold">Your Emotional Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 px-3 pb-2.5">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50">
              <span className="text-xs text-muted-foreground font-medium">Most Common</span>
              <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs h-5">😌 Calm</Badge>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-gray-50">
              <span className="text-xs text-muted-foreground font-medium">This Week</span>
              <Badge variant="secondary" className="border text-xs h-5">
                12 entries
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1.5 border-t">
              Keep up your consistent practice!
            </p>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}
