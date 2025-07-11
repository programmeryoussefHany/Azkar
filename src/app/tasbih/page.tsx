'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Sparkles, RotateCcw, Volume2, VolumeX, Target } from 'lucide-react'
import Link from 'next/link'

const TASBIH_OPTIONS = [
  { text: 'سُبْحَانَ اللَّهِ', translation: 'سبحان الله', color: 'from-green-500 to-emerald-600' },
  { text: 'الْحَمْدُ لِلَّهِ', translation: 'الحمد لله', color: 'from-blue-500 to-cyan-600' },
  { text: 'اللَّهُ أَكْبَرُ', translation: 'الله أكبر', color: 'from-purple-500 to-indigo-600' },
  { text: 'لَا إِلَهَ إِلَّا اللَّهُ', translation: 'لا إله إلا الله', color: 'from-red-500 to-pink-600' },
  { text: 'أَسْتَغْفِرُ اللَّهَ', translation: 'أستغفر الله', color: 'from-orange-500 to-yellow-500' },
  { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translation: 'لا حول ولا قوة إلا بالله', color: 'from-teal-500 to-green-500' }
]

export default function TasbihPage() {
  const [count, setCount] = useState(0)
  const [selectedTasbih, setSelectedTasbih] = useState(0)
  const [target, setTarget] = useState(33)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    // Load saved data from localStorage
    const savedCount = localStorage.getItem('tasbih-count')
    const savedTasbih = localStorage.getItem('tasbih-selected')
    const savedTarget = localStorage.getItem('tasbih-target')
    const savedSound = localStorage.getItem('tasbih-sound')
    const savedVibration = localStorage.getItem('tasbih-vibration')
    const savedTotal = localStorage.getItem('tasbih-total')

    if (savedCount) setCount(parseInt(savedCount))
    if (savedTasbih) setSelectedTasbih(parseInt(savedTasbih))
    if (savedTarget) setTarget(parseInt(savedTarget))
    if (savedSound) setSoundEnabled(JSON.parse(savedSound))
    if (savedVibration) setVibrationEnabled(JSON.parse(savedVibration))
    if (savedTotal) setTotalCount(parseInt(savedTotal))
  }, [])

  const handleCount = () => {
    const newCount = count + 1
    const newTotal = totalCount + 1

    setCount(newCount)
    setTotalCount(newTotal)

    // Save to localStorage
    localStorage.setItem('tasbih-count', newCount.toString())
    localStorage.setItem('tasbih-total', newTotal.toString())

    // Vibration feedback
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    // Sound feedback (simple beep)
    if (soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (error) {
        console.log('Audio not supported')
      }
    }

    // Check if target reached
    if (newCount === target) {
      if (vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 100])
      }
    }
  }

  const resetCount = () => {
    setCount(0)
    localStorage.setItem('tasbih-count', '0')
  }

  const resetTotal = () => {
    setTotalCount(0)
    localStorage.setItem('tasbih-total', '0')
  }

  const changeTasbih = (index: number) => {
    setSelectedTasbih(index)
    localStorage.setItem('tasbih-selected', index.toString())
  }

  const changeTarget = (newTarget: number) => {
    setTarget(newTarget)
    localStorage.setItem('tasbih-target', newTarget.toString())
  }

  const toggleSound = () => {
    const newSound = !soundEnabled
    setSoundEnabled(newSound)
    localStorage.setItem('tasbih-sound', JSON.stringify(newSound))
  }

  const toggleVibration = () => {
    const newVibration = !vibrationEnabled
    setVibrationEnabled(newVibration)
    localStorage.setItem('tasbih-vibration', JSON.stringify(newVibration))
  }

  const currentTasbih = TASBIH_OPTIONS[selectedTasbih]
  const progress = target > 0 ? (count / target) * 100 : 0
  const isCompleted = count >= target && target > 0

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
        
        <div className={`bg-gradient-to-r ${currentTasbih.color} rounded-xl p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 arabic-text flex items-center">
                <Sparkles className="w-8 h-8 ml-3" />
                عداد التسبيح
              </h1>
              <p className="text-white/80 arabic-text">
                اذكر الله واحصل على الأجر والثواب
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {totalCount}
              </div>
              <div className="text-sm text-white/80">
                إجمالي التسبيحات
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Counter */}
      <div className="mb-8">
        <div className={`bg-gradient-to-br ${currentTasbih.color} rounded-2xl p-8 text-white text-center shadow-2xl`}>
          {/* Current Tasbih Text */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold arabic-text mb-2">
              {currentTasbih.text}
            </h2>
            <p className="text-white/80 text-lg">
              {currentTasbih.translation}
            </p>
          </div>

          {/* Counter Display */}
          <div className="mb-6">
            <div className="text-6xl font-bold mb-2">
              {count}
            </div>
            {target > 0 && (
              <div className="text-white/80">
                من {target}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {target > 0 && (
            <div className="mb-6">
              <div className="bg-white/20 rounded-full h-3 mb-2">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-white/80">
                {Math.round(progress)}% مكتمل
              </div>
            </div>
          )}

          {/* Completion Message */}
          {isCompleted && (
            <div className="mb-6 p-4 bg-white/20 rounded-lg">
              <p className="text-lg font-bold arabic-text">
                🎉 مبارك! لقد أكملت الهدف
              </p>
            </div>
          )}

          {/* Main Count Button */}
          <button
            onClick={handleCount}
            className="w-32 h-32 bg-white/20 hover:bg-white/30 rounded-full text-white font-bold text-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            سبح
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Tasbih Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4 arabic-text">اختر التسبيح</h3>
          <div className="space-y-2">
            {TASBIH_OPTIONS.map((option, index) => (
              <button
                key={index}
                onClick={() => changeTasbih(index)}
                className={`
                  w-full p-3 rounded-lg text-right transition-colors arabic-text
                  ${selectedTasbih === index
                    ? `bg-gradient-to-r ${option.color} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <div className="font-medium">{option.text}</div>
                <div className="text-sm opacity-80">{option.translation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4 arabic-text">الإعدادات</h3>
          
          {/* Target Setting */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 arabic-text">
              <Target className="w-4 h-4 inline ml-1" />
              الهدف
            </label>
            <div className="flex gap-2">
              {[33, 99, 100, 1000].map((targetOption) => (
                <button
                  key={targetOption}
                  onClick={() => changeTarget(targetOption)}
                  className={`
                    px-3 py-1 rounded text-sm font-medium transition-colors
                    ${target === targetOption
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {targetOption}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="mb-4">
            <button
              onClick={toggleSound}
              className={`
                flex items-center justify-between w-full p-3 rounded-lg transition-colors
                ${soundEnabled
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <span className="arabic-text">الصوت</span>
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="mb-4">
            <button
              onClick={toggleVibration}
              className={`
                flex items-center justify-between w-full p-3 rounded-lg transition-colors
                ${vibrationEnabled
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <span className="arabic-text">الاهتزاز</span>
              <span className="text-lg">{vibrationEnabled ? '📳' : '🔇'}</span>
            </button>
          </div>

          {/* Reset Buttons */}
          <div className="space-y-2">
            <button
              onClick={resetCount}
              className="w-full flex items-center justify-center gap-2 p-3 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="arabic-text">إعادة تعيين العداد</span>
            </button>
            
            <button
              onClick={resetTotal}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="arabic-text">إعادة تعيين الإجمالي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
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
