"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Gift, Sparkles, X, Ban } from "lucide-react"

type PrizeType = "money" | "negative" | "skip" | "null"

interface Prize {
  type: PrizeType
  amount?: number
  label: string
}

// Prize distribution that totals 20 million tomans
const basePrizes: Prize[] = [
  { type: "money", amount: 5000000, label: "۵ میلیون تومان" },
  { type: "money", amount: 3000000, label: "۳ میلیون تومان" },
  { type: "money", amount: 2500000, label: "۲.۵ میلیون تومان" },
  { type: "money", amount: 2000000, label: "۲ میلیون تومان" },
  { type: "money", amount: 1500000, label: "۱.۵ میلیون تومان" },
  { type: "money", amount: 1500000, label: "۱.۵ میلیون تومان" },
  { type: "money", amount: 1000000, label: "۱ میلیون تومان" },
  { type: "money", amount: 1000000, label: "۱ میلیون تومان" },
  { type: "money", amount: 800000, label: "۸۰۰ هزار تومان" },
  { type: "money", amount: 700000, label: "۷۰۰ هزار تومان" },
  { type: "money", amount: 500000, label: "۵۰۰ هزار تومان" },
  { type: "money", amount: 500000, label: "۵۰۰ هزار تومان" },
  { type: "negative", amount: -500000, label: "منفی ۵۰۰ هزار تومان" },
  { type: "negative", amount: -300000, label: "منفی ۳۰۰ هزار تومان" },
  { type: "negative", amount: -200000, label: "منفی ۲۰۰ هزار تومان" },
  { type: "skip", label: "رد شو" },
  { type: "skip", label: "رد شو" },
  { type: "null", label: "پوچ" },
  { type: "null", label: "پوچ" },
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
  const [revealed, setRevealed] = useState<boolean[]>(new Array(20).fill(false))
  const [totalWon, setTotalWon] = useState(0)

  useEffect(() => {
    setPrizes(shuffleArray(basePrizes))
  }, [])

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
    }
  }

  return (
    <div className="max-w-6xl mx-auto" dir="rtl">
      {/* Header with Prize Calculator */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-right">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            20 20
          </h1>
          <p className="text-muted-foreground leading-7 text-2xl font-semibold">CafetradeTV</p>
        </div>

        <Card className="border-none shadow-none bg-transparent p-6 min-w-[280px]">
          <div className="text-center">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold mb-2">
              مجموع جوایز برنده شده
            </p>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-1">
              {formatNumber(totalWon)}
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold">
              تومان
            </p>
          </div>
        </Card>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-5 gap-3 md:gap-4">
        {prizes.map((prize, index) => (
          <Card
            key={index}
            onClick={() => handleSquareClick(index)}
            className={`
              aspect-square cursor-pointer transition-all duration-500 transform relative overflow-hidden group
              ${
                revealed[index]
                  ? `${getPrizeColor(prize.type)} scale-105 shadow-xl`
                  : "bg-zinc-900 hover:scale-105 shadow-lg hover:shadow-2xl border-purple-400"
              }
              flex flex-col items-center justify-center p-2 md:p-4
            `}
          >
            {!revealed[index] ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 opacity-60 group-hover:opacity-90 blur transition-opacity duration-500" />

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
                    <p className="text-xs md:text-sm font-bold text-foreground/70 mb-1">
                      {new Intl.NumberFormat("fa-IR").format(index + 1)}
                    </p>
                    <p className="text-sm md:text-base font-black text-foreground text-balance leading-tight">
                      {prize.label}
                    </p>
                  </div>
                  <img src="/logo.png" alt="logo" className="w-8 h-8 md:w-10 md:h-10 opacity-20 mt-1" />
                </div>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <Card className="inline-block bg-white/80 backdrop-blur-sm border-purple-200 p-4">
          <p className="text-sm text-muted-foreground">
            مجموع کل جوایز: <span className="font-bold text-primary">۲۰ میلیون تومان</span>
          </p>
        </Card>
      </div>
    </div>
  )
}
