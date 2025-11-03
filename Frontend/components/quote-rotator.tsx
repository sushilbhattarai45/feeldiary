"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"

const quotes = [
  {
    id: 1,
    text: "Peace begins with a smile.",
    author: "Mother Teresa",
  },
  {
    id: 2,
    text: "The best way out is always through.",
    author: "Robert Frost",
  },
  {
    id: 3,
    text: "Your feelings are valid, your growth is visible.",
    author: "Anonymous",
  },
  {
    id: 4,
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    id: 5,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
]

export function QuoteRotator() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-20 flex items-center justify-center bg-gradient-to-r from-gray-50  to-white border-b overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center px-6 h-full"
        >
          {/* I want t change the height */}
          <div className="flex items-center gap-2 max-w-4xl  w-full  
          ">
            <Quote className="text-primary/40 " height={100} />
            <p className="text-xs text-gray-600 italic flex-1">"{quotes[currentIndex].text}"</p>
            <span className="text-xs text-gray-500 font-medium flex-shrink-0">— {quotes[currentIndex].author}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {quotes.map((_, idx) => (
          <div
            key={idx}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-4 bg-primary" : "w-0.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
