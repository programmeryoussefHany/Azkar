'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Settings, Sun, Moon, Type, Volume2, VolumeX, Smartphone, Trash2, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState('medium')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrationEnabled, setVibrationEnabled] = useState(true)

  useEffect(() => {
    // Load settings from localStorage
    const savedFontSize = localStorage.getItem('azkar-font-size')
    const savedSound = localStorage.getItem('azkar-sound')
    const savedVibration = localStorage.getItem('azkar-vibration')

    if (savedFontSize) setFontSize(savedFontSize)
    if (savedSound) setSoundEnabled(JSON.parse(savedSound))
    if (savedVibration) setVibrationEnabled(JSON.parse(savedVibration))
  }, [])

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem('azkar-font-size', size)
    
    // Apply font size to document
    const root = document.documentElement
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl')
    
    switch (size) {
      case 'small':
        root.classList.add('text-sm')
        break
      case 'medium':
        root.classList.add('text-base')
        break
      case 'large':
        root.classList.add('text-lg')
        break
      case 'extra-large':
        root.classList.add('text-xl')
        break
    }
  }

  const handleSoundToggle = () => {
    const newSound = !soundEnabled
    setSoundEnabled(newSound)
    localStorage.setItem('azkar-sound', JSON.stringify(newSound))
  }

  const handleVibrationToggle = () => {
    const newVibration = !vibrationEnabled
    setVibrationEnabled(newVibration)
    localStorage.setItem('azkar-vibration', JSON.stringify(newVibration))
  }

  const clearAllData = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ سيتم حذف المفضلة والتقدم وجميع الإعدادات.')) {
      // Clear all localStorage data
      const keysToRemove = [
        'azkar-favorites',
        'azkar-completed-morning',
        'azkar-completed-evening',
        'azkar-counts-morning',
        'azkar-counts-evening',
        'tasbih-count',
        'tasbih-total',
        'tasbih-selected',
        'tasbih-target',
        'azkar-font-size',
        'azkar-sound',
        'azkar-vibration'
      ]

      keysToRemove.forEach(key => localStorage.removeItem(key))

      // Reset state
      setFontSize('medium')
      setSoundEnabled(true)
      setVibrationEnabled(true)

      alert('تم حذف جميع البيانات بنجاح')
    }
  }

  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق أذكاري',
        text: 'تطبيق رائع للأذكار الإسلامية اليومية',
        url: window.location.origin
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.origin)
      alert('تم نسخ رابط التطبيق')
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
        
        <div className="bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 arabic-text flex items-center">
            <Settings className="w-8 h-8 ml-3" />
            الإعدادات
          </h1>
          <p className="text-gray-100 arabic-text">
            تخصيص التطبيق حسب تفضيلاتك
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 arabic-text">المظهر</h2>
          
          {/* Theme Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 arabic-text">الوضع</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                  ${theme === 'light'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 ring-2 ring-yellow-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <Sun className="w-5 h-5" />
                <span className="arabic-text">فاتح</span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg transition-colors
                  ${theme === 'dark'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 ring-2 ring-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <Moon className="w-5 h-5" />
                <span className="arabic-text">داكن</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium mb-3 arabic-text">
              <Type className="w-4 h-4 inline ml-1" />
              حجم الخط
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'small', label: 'صغير' },
                { value: 'medium', label: 'متوسط' },
                { value: 'large', label: 'كبير' },
                { value: 'extra-large', label: 'كبير جداً' }
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFontSizeChange(size.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors arabic-text
                    ${fontSize === size.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>



        {/* Audio & Haptic Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 arabic-text">الصوت والاهتزاز</h2>
          
          <div className="space-y-4">
            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              className={`
                flex items-center justify-between w-full p-4 rounded-lg transition-colors
                ${soundEnabled
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="arabic-text">الأصوات</span>
              </div>
              <span className="text-sm">
                {soundEnabled ? 'مفعل' : 'معطل'}
              </span>
            </button>

            {/* Vibration Toggle */}
            <button
              onClick={handleVibrationToggle}
              className={`
                flex items-center justify-between w-full p-4 rounded-lg transition-colors
                ${vibrationEnabled
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5" />
                <span className="arabic-text">الاهتزاز</span>
              </div>
              <span className="text-sm">
                {vibrationEnabled ? 'مفعل' : 'معطل'}
              </span>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 arabic-text">إدارة البيانات</h2>

          <div className="space-y-3">
            {/* Share App */}
            <button
              onClick={shareApp}
              className="w-full flex items-center justify-center gap-3 p-4 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="arabic-text">مشاركة التطبيق</span>
            </button>

            {/* Clear All Data */}
            <button
              onClick={clearAllData}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="arabic-text">حذف جميع البيانات</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
          <h2 className="text-xl font-bold mb-4 arabic-text">معلومات التطبيق</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p className="arabic-text">تطبيق أذكاري</p>
            <p>الإصدار 1.0.0</p>
            <p className="arabic-text">تطبيق مجاني للأذكار الإسلامية</p>
          </div>
        </div>
      </div>
    </div>
  )
}
