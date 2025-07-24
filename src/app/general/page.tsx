'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Filter } from 'lucide-react'
import Link from 'next/link'
import DhikrCard from '@/components/DhikrCard'
import generalAdhkar from '@/data/general-adhkar.json'

export default function GeneralPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const savedFavorites = localStorage.getItem('azkar-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const handleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id]
    
    setFavorites(newFavorites)
    localStorage.setItem('azkar-favorites', JSON.stringify(newFavorites))
  }

  const categories = ['all', ...Array.from(new Set(generalAdhkar.map(dhikr => dhikr.category)))]

  const filteredAdhkar = selectedCategory === 'all' 
    ? generalAdhkar 
    : generalAdhkar.filter(dhikr => dhikr.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'النوم': '🌙',
      'الاستيقاظ': '☀️',
      'السفر': '🚗',
      'دخول المنزل': '🏠',
      'الخروج من المنزل': '🚪',
      'الطعام': '🍽️',
      'دخول الخلاء': '🚿',
      'الخروج من الخلاء': '✨',
      'لبس الثوب': '👕',
      'خلع الثوب': '🧥',
      'الوضوء': '💧',
      'الصلاة': '🕌',
      'الجمعة': '📿',
      'الهم والحزن': '😔',
      'المرض': '🤒'
    }
    return icons[category] || '📿'
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'النوم': 'from-indigo-500 to-purple-600',
      'الاستيقاظ': 'from-yellow-400 to-orange-500',
      'السفر': 'from-blue-500 to-cyan-600',
      'دخول المنزل': 'from-green-500 to-emerald-600',
      'الخروج من المنزل': 'from-red-500 to-pink-600',
      'الطعام': 'from-orange-500 to-red-500',
      'دخول الخلاء': 'from-gray-500 to-gray-600',
      'الخروج من الخلاء': 'from-teal-500 to-blue-600',
      'لبس الثوب': 'from-lime-500 to-green-500',
      'خلع الثوب': 'from-rose-400 to-pink-500',
      'الوضوء': 'from-sky-400 to-blue-500',
      'الصلاة': 'from-amber-500 to-yellow-600',
      'الجمعة': 'from-indigo-600 to-blue-700',
      'الهم والحزن': 'from-gray-600 to-gray-800',
      'المرض': 'from-red-400 to-orange-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="max-w-4xl mx-auto">
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

        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 arabic-text flex items-center">
                <BookOpen className="w-8 h-8 ml-3" />
                الأذكار العامة
              </h1>
              <p className="text-green-100 arabic-text">
                أذكار متنوعة لمختلف المناسبات والأوقات
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {filteredAdhkar.length}
              </div>
              <div className="text-sm text-green-100">
                ذكر
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 ml-2 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400 arabic-text">تصفية حسب المناسبة:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors arabic-text
                ${selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              {category === 'all' ? 'جميع الأذكار' : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory !== 'all' && (
        <div className={`bg-gradient-to-r ${getCategoryColor(selectedCategory)} rounded-lg p-4 mb-6 text-white`}>
          <h2 className="text-xl font-bold arabic-text flex items-center">
            <span className="text-2xl ml-3">{getCategoryIcon(selectedCategory)}</span>
            أذكار {selectedCategory}
          </h2>
          <p className="text-sm opacity-90 mt-1">
            {filteredAdhkar.length} ذكر في هذه الفئة
          </p>
        </div>
      )}

      <div className="space-y-6">
        {filteredAdhkar.map((dhikr, index) => (
          <div key={dhikr.id} className="relative">
            <div className={`
              absolute -right-3 -top-3 px-3 py-1 rounded-full text-xs font-medium text-white z-10
              bg-gradient-to-r ${getCategoryColor(dhikr.category)}
            `}>
              {getCategoryIcon(dhikr.category)} {dhikr.category}
            </div>

            <DhikrCard
              dhikr={dhikr}
              onFavorite={handleFavorite}
              isFavorite={favorites.includes(dhikr.id)}
            />
          </div>
        ))}
      </div>

      {filteredAdhkar.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2 arabic-text">
            لا توجد أذكار في هذه الفئة
          </h3>
          <p className="text-gray-500 dark:text-gray-500 arabic-text">
            جرب اختيار فئة أخرى أو عرض جميع الأذكار
          </p>
        </div>
      )}

      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-gray-600 dark:text-gray-300 arabic-text mb-2">
          &ldquo;وَالذَّاكِرِينَ اللَّهَ كَثِيرًا وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُم مَّغْفِرَةً وَأَجْرًا عَظِيمًا&rdquo;
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          سورة الأحزاب - آية 35
        </p>
      </div>
    </div>
  )
}
