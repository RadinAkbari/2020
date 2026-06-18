"use client"

import { useEffect, useState } from "react"
import { Ban, Gift, HelpCircle, RotateCcw, Skull, Sparkles, X } from "lucide-react"

import arabicQuestionsData from "@/data/arabic-questions.json"
import { Card } from "@/components/ui/card"

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
  { type: "gameover", label: "انتهت اللعبة" },
  { type: "money", amount: 18.75, label: "١٨.٧٥ دولار" },
  { type: "money", amount: 15.625, label: "١٥.٦٢٥ دولار" },
  { type: "money", amount: 12.5, label: "١٢.٥ دولار" },
  { type: "money", amount: 9.375, label: "٩.٣٧٥ دولار" },
  { type: "money", amount: 7.5, label: "٧.٥ دولار" },
  { type: "money", amount: 6.25, label: "٦.٢٥ دولار" },
  { type: "money", amount: 5, label: "٥ دولار" },
  { type: "negative", amount: -6.25, label: "ناقص ٦.٢٥ دولار" },
  { type: "negative", amount: -6.25, label: "ناقص ٦.٢٥ دولار" },
  { type: "skip", label: "تجاوز" },
  { type: "null", label: "فارغ" },
]

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ArabicPrizeGame() {
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
    const availableIndices = arabicQuestionsData
      .map((_, index) => index)
      .filter((index) => !usedQuestionIndices.has(index))

    if (availableIndices.length === 0) {
      const randomIndex = Math.floor(Math.random() * arabicQuestionsData.length)
      setUsedQuestionIndices(new Set([randomIndex]))
      setCurrentQuestion(arabicQuestionsData[randomIndex])
      setShowAnswer(false)
      setShowQuestionPopup(true)
      return
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    setCurrentQuestion(arabicQuestionsData[randomIndex])
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
    return new Intl.NumberFormat("ar").format(Math.abs(num))
  }

  const getPrizeIcon = (type: PrizeType) => {
    switch (type) {
      case "money":
        return <Gift className="h-8 w-8 text-green-500" />
      case "negative":
        return <X className="h-8 w-8 text-red-500" />
      case "skip":
        return <Sparkles className="h-8 w-8 text-yellow-500" />
      case "null":
        return <Ban className="h-8 w-8 text-gray-400" />
      case "gameover":
        return <Skull className="h-8 w-8 text-purple-600" />
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
    <div className="mx-auto max-w-6xl" dir="rtl" lang="ar">
      {showQuestionPopup && currentQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-orange-500/50 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-8 shadow-2xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-black leading-relaxed text-white md:text-4xl">
                {currentQuestion.question}
              </h2>

              {currentQuestion.choices && currentQuestion.choices.length > 0 && (
                <div className="mt-6 space-y-3">
                  {currentQuestion.choices.map((choice, index) => (
                    <div
                      key={index}
                      className={`
                        rounded-xl border-2 p-4 transition-all duration-500
                        ${
                          showAnswer && choice === currentQuestion.answer
                            ? "border-green-500 bg-green-500/30 shadow-lg shadow-green-500/50"
                            : "border-white/30 bg-white/10"
                        }
                      `}
                    >
                      <p className="text-xl font-bold leading-relaxed text-white md:text-2xl">{choice}</p>
                    </div>
                  ))}
                </div>
              )}

              {showAnswer && (!currentQuestion.choices || currentQuestion.choices.length === 0) && (
                <div className="animate-in fade-in zoom-in rounded-xl border-2 border-orange-500 bg-orange-500/20 p-6 duration-500">
                  <p className="mb-2 text-sm font-semibold text-orange-300">الإجابة:</p>
                  <p className="text-2xl font-black leading-relaxed text-white md:text-3xl">
                    {currentQuestion.answer}
                  </p>
                </div>
              )}

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                {!showAnswer ? (
                  <button
                    onClick={handleRevealAnswer}
                    className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-emerald-600 hover:shadow-xl"
                  >
                    أظهر الإجابة
                  </button>
                ) : (
                  <button
                    onClick={showRandomQuestion}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl"
                  >
                    اسأل سؤالا آخر
                  </button>
                )}
                <button
                  onClick={handleOpenSquare}
                  className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-amber-600 hover:shadow-xl"
                >
                  افتح الخانة
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-center md:text-right">
          <h1 className="mb-2 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
            ٢٠ ٢٠
          </h1>
          <p className="text-2xl font-semibold leading-7 text-white">نبض بلس</p>
        </div>

        <Card className="min-w-[280px] border-none bg-transparent p-6 shadow-none">
          <div className="text-center">
            <p className="mb-2 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-sm font-semibold text-transparent">
              مجموع الجوائز التي ربحتها
            </p>
            <div className="mb-1 bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-4xl font-black text-transparent">
              {formatNumber(totalWon)}
            </div>
            <p className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-lg font-bold text-transparent">
              دولار
            </p>
          </div>
        </Card>
      </div>

      <div className="relative rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-1 shadow-2xl">
        <div className="relative rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 p-1">
          <div className="relative rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 shadow-inner md:p-8">
            <div className="absolute left-2 top-2 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-amber-400/50" />
            <div className="absolute right-2 top-2 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-amber-400/50" />
            <div className="absolute bottom-2 left-2 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-amber-400/50" />
            <div className="absolute bottom-2 right-2 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-amber-400/50" />

            <div className="grid grid-cols-4 gap-3 md:gap-4">
              {prizes.map((prize, index) => (
                <Card
                  key={index}
                  onClick={() => handleSquareClick(index)}
                  className={`
                    group relative aspect-square cursor-pointer overflow-hidden p-2 transition-all duration-500 md:p-4
                    ${
                      revealed[index]
                        ? `${getPrizeColor(prize.type)} scale-105 shadow-xl`
                        : "border-orange-400 bg-zinc-900 shadow-lg hover:scale-105 hover:shadow-2xl"
                    }
                    flex flex-col items-center justify-center
                  `}
                >
                  {!revealed[index] ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 opacity-90 blur transition-all duration-500 group-hover:from-orange-400 group-hover:via-amber-400 group-hover:to-orange-500 group-hover:opacity-100" />

                      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
                        <div className="text-5xl font-black text-white drop-shadow-lg md:text-6xl">
                          {new Intl.NumberFormat("en-US").format(index + 1)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="animate-in zoom-in flex flex-col items-center justify-center gap-2 duration-500">
                      {getPrizeIcon(prize.type)}
                      <div className="text-center">
                        <p className="mb-1 text-xs font-bold text-black/50 md:text-sm">
                          {new Intl.NumberFormat("en-US").format(index + 1)}
                        </p>
                        <p className="text-balance text-3xl font-black leading-tight text-black">{prize.label}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
        <button
          onClick={showRandomQuestion}
          className="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl"
        >
          <HelpCircle className="h-5 w-5" />
          <span>اسأل سؤالا</span>
        </button>
        <button
          onClick={handleReset}
          className="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-orange-700 hover:to-amber-600 hover:shadow-xl"
        >
          <RotateCcw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
          <span>ابدأ اللعبة من جديد</span>
        </button>
      </div>
    </div>
  )
}
