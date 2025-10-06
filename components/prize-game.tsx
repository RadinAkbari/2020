"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Gift, Sparkles, X, Ban, Skull, RotateCcw, HelpCircle } from "lucide-react"
import questionsData from "@/data/questions.json"

type PrizeType = "money" | "negative" | "skip" | "null" | "gameover"

interface Prize {
  type: PrizeType
  amount?: number
  label: string
}

interface Question {
  source: string
  question: string
  answer: string
  choices?: string[]
}

const basePrizes: Prize[] = [
  { type: "gameover", label: "گیم اور" },
  { type: "money", amount: 3000000, label: "۳ میلیون تومان" },
  { type: "money", amount: 2500000, label: "۲.۵ میلیون تومان" },
  { type: "money", amount: 2000000, label: "۲ میلیون تومان" },
  { type: "money", amount: 1500000, label: "۱.۵ میلیون تومان" },
  { type: "money", amount: 1200000, label: "۱.۲ میلیون تومان" },
  { type: "money", amount: 1000000, label: "۱ میلیون تومان" },
  { type: "money", amount: 800000, label: "۸۰۰ هزار تومان" },
  { type: "negative", amount: -1000000, label: "منفی ۱ میلیون تومان" },
  { type: "negative", amount: -1000000, label: "منفی ۱ میلیون تومان" },
  { type: "skip", label: "رد شو" },
  { type: "null", label: "پوچ" },
]

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function PrizeGame() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [revealed, setRevealed] = useState<boolean[]>(new Array(12).fill(false))
  const [totalWon, setTotalWon] = useState(0)

  const [showQuestionPopup, setShowQuestionPopup] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    setPrizes(shuffleArray(basePrizes))
    showRandomQuestion()
  }, [])

  const showRandomQuestion = () => {
    const multipleChoiceQuestions = questionsData.filter((q) => q.choices && q.choices.length > 0)

    const availableIndices = multipleChoiceQuestions
      .map((_, index) => index)
      .filter((index) => !usedQuestionIndices.has(index))

    if (availableIndices.length === 0) {
      // All questions used, reset
      setUsedQuestionIndices(new Set())
      return showRandomQuestion()
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    setCurrentQuestion(multipleChoiceQuestions[randomIndex])
    setUsedQuestionIndices((prev) => new Set([...prev, randomIndex]))
    setShowAnswer(false)
    setShowQuestionPopup(true)
  }

  const handleReset = () => {
    setPrizes(shuffleArray(basePrizes))
    setRevealed(new Array(12).fill(false))
    setTotalWon(0)
  }

  const handleOpenSquare = () => {
    setShowQuestionPopup(false)
  }

  const handleRevealAnswer = () => {
    setShowAnswer(true)
  }

  const handleSquareClick = (index: number) => {
    if (revealed[index]) return

    const newRevealed = [...revealed]
    newRevealed[index] = true
    setRevealed(newRevealed)

    const prize = prizes[index]
    if (prize.type === "money" || prize.type === "negative") {
      setTotalWon((prev) => prev + (prize.amount || 0))
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(Math.abs(num))
  }

  const getPrizeIcon = (type: PrizeType) => {
    switch (type) {
      case "money":
        return <Gift className="w-8 h-8 text-green-500" />
      case "negative":
        return <X className="w-8 h-8 text-red-500" />
      case "skip":
        return <Sparkles className="w-8 h-8 text-yellow-500" />
      case "null":
        return <Ban className="w-8 h-8 text-gray-400" />
      case "gameover":
        return <Skull className="w-8 h-8 text-purple-600" />
    }
  }

  const getPrizeColor = (type: PrizeType) => {
    switch (type) {
      case "money":
        return "bg-gradient-to-br from-green-50 to-emerald-100 border-green-300"
      case "negative":
        return "bg-gradient-to-br from-red-50 to-rose-100 border-red-300"
      case "skip":
        return "bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-300"
      case "null":
        return "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-300"
      case "gameover":
        return "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-400"
    }
  }

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      {showQuestionPopup && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="max-w-2xl w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-orange-500/50 p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-white leading-relaxed">{currentQuestion.question}</h2>

              {currentQuestion.choices && currentQuestion.choices.length > 0 && (
                <div className="space-y-3 mt-6">
                  {currentQuestion.choices.map((choice, index) => (
                    <div
                      key={index}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-500
                        ${
                          showAnswer && choice === currentQuestion.answer
                            ? "bg-green-500/30 border-green-500 shadow-lg shadow-green-500/50"
                            : "bg-white/10 border-white/30"
                        }
                      `}
                    >
                      <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">{choice}</p>
                    </div>
                  ))}
                </div>
              )}

              {showAnswer && (!currentQuestion.choices || currentQuestion.choices.length === 0) && (
                <div className="animate-in fade-in zoom-in duration-500 bg-orange-500/20 border-2 border-orange-500 rounded-xl p-6">
                  <p className="text-sm text-orange-300 mb-2 font-semibold">پاسخ:</p>
                  <p className="text-2xl md:text-3xl font-black text-white leading-relaxed">{currentQuestion.answer}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {!showAnswer ? (
                  <button
                    onClick={handleRevealAnswer}
                    className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    نمایش پاسخ
                  </button>
                ) : (
                  <button
                    onClick={showRandomQuestion}
                    className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    سوال دیگر بپرس
                  </button>
                )}
                <button
                  onClick={handleOpenSquare}
                  className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  باز کردن خانه
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header with Prize Calculator */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-right">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-2">
            20 20
          </h1>
          <p className="leading-7 text-2xl font-semibold text-white">CafetradeTV</p>
        </div>

        <Card className="border-none shadow-none bg-transparent p-6 min-w-[280px]">
          <div className="text-center">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 text-sm font-semibold mb-2">
              مجموع جوایز برنده شده
            </p>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 mb-1">
              {formatNumber(totalWon)}
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 text-lg font-bold">
              تومان
            </p>
          </div>
        </Card>
      </div>

      {/* Game Grid with Luxury Border Frame */}
      <div className="relative p-1 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 shadow-2xl">
        {/* Inner border layer */}
        <div className="relative p-1 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500">
          {/* Dark background layer */}
          <div className="relative p-6 md:p-8 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-inner">
            {/* Decorative corner accents */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/50 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/50 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/50 rounded-br-lg" />

            {/* Game Grid */}
            <div className="grid grid-cols-4 gap-3 md:gap-4">
              {prizes.map((prize, index) => (
                <Card
                  key={index}
                  onClick={() => handleSquareClick(index)}
                  className={`
                    aspect-square cursor-pointer transition-all duration-500 transform relative overflow-hidden group
                    ${
                      revealed[index]
                        ? `${getPrizeColor(prize.type)} scale-105 shadow-xl`
                        : "bg-zinc-900 hover:scale-105 shadow-lg hover:shadow-2xl border-orange-400"
                    }
                    flex flex-col items-center justify-center p-2 md:p-4
                  `}
                >
                  {!revealed[index] ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-90 group-hover:opacity-100 group-hover:from-orange-400 group-hover:via-amber-400 group-hover:to-orange-500 blur transition-all duration-500" />

                      {/* Unrevealed State */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                        <div className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">
                          {new Intl.NumberFormat("fa-IR").format(index + 1)}
                        </div>
                        <img src="/logo.png" alt="logo" className="w-12 h-12 md:w-16 opacity-30 md:h-[26px]" />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Revealed State */}
                      <div className="flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-500">
                        {getPrizeIcon(prize.type)}
                        <div className="text-center">
                          <p className="text-xs md:text-sm font-bold text-white/70 mb-1">
                            {new Intl.NumberFormat("fa-IR").format(index + 1)}
                          </p>
                          <p className="font-black text-black text-balance leading-tight text-3xl">{prize.label}</p>
                        </div>
                        <img src="/logo.png" alt="logo" className="w-8 h-8 md:w-10 md:h-10 opacity-20 mt-1" />
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={showRandomQuestion}
          className="group relative px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-5 h-5" />
          <span>سوال بپرس</span>
        </button>
        <button
          onClick={handleReset}
          className="group relative px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>شروع مجدد بازی</span>
        </button>
      </div>
    </div>
  )
}
