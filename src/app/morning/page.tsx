'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Sun, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import DhikrCard from '@/components/DhikrCard'
import morningAdhkar from '@/data/morning-adhkar.json'

export default function MorningPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [favorites, setFavorites] = useState<string[]>([])
  const [completedAdhkar, setCompletedAdhkar] = useState<string[]>([])
  const [dhikrCounts, setDhikrCounts] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('azkar-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Load completed adhkar from localStorage
    const savedCompleted = localStorage.getItem('azkar-completed-morning')
    if (savedCompleted) {
      setCompletedAdhkar(JSON.parse(savedCompleted))
    }

    // Load dhikr counts from localStorage
    const savedCounts = localStorage.getItem('azkar-counts-morning')
    if (savedCounts) {
      setDhikrCounts(JSON.parse(savedCounts))
    }

    return () => clearInterval(timer)
  }, [])

  const handleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id]
    
    setFavorites(newFavorites)
    localStorage.setItem('azkar-favorites', JSON.stringify(newFavorites))
  }

  const handleComplete = (id: string) => {
    const dhikr = morningAdhkar.find(d => d.id === id)
    const requiredCount = dhikr?.count || 1
    const currentCount = dhikrCounts[id] || 0

    if (completedAdhkar.includes(id)) {
      // إذا كان مكتملاً، قم بإلغاء الإكمال
      const newCompleted = completedAdhkar.filter(comp => comp !== id)
      setCompletedAdhkar(newCompleted)
      localStorage.setItem('azkar-completed-morning', JSON.stringify(newCompleted))

      // إعادة تعيين العداد إلى 0
      handleDhikrCount(id, 0)
    } else {
      // إذا لم يكن مكتملاً، قم بإكماله
      const newCompleted = [...completedAdhkar, id]
      setCompletedAdhkar(newCompleted)
      localStorage.setItem('azkar-completed-morning', JSON.stringify(newCompleted))

      // تعيين العداد إلى العدد المطلوب
      handleDhikrCount(id, requiredCount)
    }
  }

  const handleDhikrCount = (id: string, count: number) => {
    const newCounts = { ...dhikrCounts, [id]: count }
    setDhikrCounts(newCounts)
    localStorage.setItem('azkar-counts-morning', JSON.stringify(newCounts))

    // التحقق من الإكمال التلقائي
    const dhikr = morningAdhkar.find(d => d.id === id)
    const requiredCount = dhikr?.count || 1

    if (count >= requiredCount && !completedAdhkar.includes(id)) {
      // إضافة إلى المكتملة تلقائياً
      const newCompleted = [...completedAdhkar, id]
      setCompletedAdhkar(newCompleted)
      localStorage.setItem('azkar-completed-morning', JSON.stringify(newCompleted))
    } else if (count < requiredCount && completedAdhkar.includes(id)) {
      // إزالة من المكتملة إذا نقص العدد
      const newCompleted = completedAdhkar.filter(comp => comp !== id)
      setCompletedAdhkar(newCompleted)
      localStorage.setItem('azkar-completed-morning', JSON.stringify(newCompleted))
    }
  }

  const resetProgress = () => {
    setCompletedAdhkar([])
    setDhikrCounts({})
    localStorage.removeItem('azkar-completed-morning')
    localStorage.removeItem('azkar-counts-morning')
  }

  // Calculate total counts and completed counts
  const totalRequiredCount = morningAdhkar.reduce((sum, dhikr) => sum + (dhikr.count || 1), 0)
  const completedCount = morningAdhkar.reduce((sum, dhikr) => {
    const currentCount = dhikrCounts[dhikr.id] || 0
    const requiredCount = dhikr.count || 1
    return sum + Math.min(currentCount, requiredCount)
  }, 0)

  const completionPercentage = Math.round((completedCount / totalRequiredCount) * 100)

  const getMorningGreeting = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) {
      return 'صباح الخير - وقت أذكار الصباح'
    } else if (hour >= 12 && hour < 17) {
      return 'يمكنك قراءة أذكار الصباح في أي وقت'
    } else {
      return 'أذكار الصباح - للقراءة عند الفجر حتى الضحى'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link 
            href="/" 
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 ml-2" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 arabic-text flex items-center">
                <Sun className="w-8 h-8 ml-3" />
                أذكار الصباح
              </h1>
              <p className="text-yellow-100 arabic-text">
                {getMorningGreeting()}
              </p>
              <div className="flex items-center mt-2 text-yellow-100">
                <Clock className="w-4 h-4 ml-2" />
                <span className="font-mono">
                  {currentTime.toLocaleTimeString('ar-SA')}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {completedCount}/{totalRequiredCount}
              </div>
              <div className="text-sm text-yellow-100">
                تكرار مكتمل
              </div>
              <div className="text-xs text-yellow-200 mt-1">
                {completionPercentage}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-yellow-300/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {completionPercentage === 100 && (
            <div className="mt-3 flex items-center text-yellow-100">
              <CheckCircle className="w-5 h-5 ml-2" />
              <span className="arabic-text">مبارك! لقد أكملت جميع أذكار الصباح</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600 dark:text-gray-400 arabic-text">
          {morningAdhkar.length} ذكر
        </div>
        
        {(completedAdhkar.length > 0 || Object.keys(dhikrCounts).length > 0) && (
          <button
            onClick={resetProgress}
            className="btn-secondary text-sm"
          >
            إعادة تعيين التقدم
          </button>
        )}
      </div>

      {/* Adhkar List */}
      <div className="space-y-6">
        {morningAdhkar.map((dhikr, index) => (
          <div key={dhikr.id} className="relative">
            {/* Number Badge */}
            <div className="absolute -right-3 -top-3 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
              {index + 1}
            </div>
            
            {/* Completion Badge */}
            {completedAdhkar.includes(dhikr.id) && (
              <div className="absolute -left-3 -top-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center z-10">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
            
            <DhikrCard
              dhikr={dhikr}
              onFavorite={handleFavorite}
              isFavorite={favorites.includes(dhikr.id)}
              currentCount={dhikrCounts[dhikr.id] || 0}
              onCountChange={handleDhikrCount}
            />
            
            {/* Complete Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => handleComplete(dhikr.id)}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-colors
                  ${completedAdhkar.includes(dhikr.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
              >
                {completedAdhkar.includes(dhikr.id) ? '✓ مكتمل' : 'تم الانتهاء'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-gray-600 dark:text-gray-300 arabic-text mb-2">
          &ldquo;فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ&rdquo;
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          سورة البقرة - آية 152
        </p>
      </div>
    </div>
  )
}
