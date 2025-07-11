'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Trash2, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import DhikrCard from '@/components/DhikrCard'
import morningAdhkar from '@/data/morning-adhkar.json'
import eveningAdhkar from '@/data/evening-adhkar.json'
import generalAdhkar from '@/data/general-adhkar.json'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Combine all adhkar
  const allAdhkar = [
    ...morningAdhkar.map(dhikr => ({ ...dhikr, category: 'morning' })),
    ...eveningAdhkar.map(dhikr => ({ ...dhikr, category: 'evening' })),
    ...generalAdhkar.map(dhikr => ({ ...dhikr, category: dhikr.category || 'general' }))
  ]

  useEffect(() => {
    // Load favorites from localStorage
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

  const clearAllFavorites = () => {
    if (confirm('هل أنت متأكد من حذف جميع المفضلة؟')) {
      setFavorites([])
      localStorage.removeItem('azkar-favorites')
    }
  }

  // Get favorite adhkar
  const favoriteAdhkar = allAdhkar.filter(dhikr => favorites.includes(dhikr.id))

  // Filter and search
  const filteredAdhkar = favoriteAdhkar.filter(dhikr => {
    const matchesSearch = dhikr.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dhikr.translation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dhikr.source.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || dhikr.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  // Get unique categories from favorites
  const categories = ['all', ...Array.from(new Set(favoriteAdhkar.map(dhikr => dhikr.category)))]

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      'all': 'جميع المفضلة',
      'morning': 'أذكار الصباح',
      'evening': 'أذكار المساء',
      'النوم': 'النوم',
      'الاستيقاظ': 'الاستيقاظ',
      'السفر': 'السفر',
      'دخول المنزل': 'دخول المنزل',
      'الخروج من المنزل': 'الخروج من المنزل',
      'الطعام': 'الطعام',
      'دخول الخلاء': 'دخول الخلاء',
      'الخروج من الخلاء': 'الخروج من الخلاء',
      'general': 'عامة'
    }
    return names[category] || category
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'morning': '☀️',
      'evening': '🌙',
      'النوم': '😴',
      'الاستيقاظ': '🌅',
      'السفر': '🚗',
      'دخول المنزل': '🏠',
      'الخروج من المنزل': '🚪',
      'الطعام': '🍽️',
      'دخول الخلاء': '🚿',
      'الخروج من الخلاء': '✨',
      'general': '📿'
    }
    return icons[category] || '📿'
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
        
        <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 arabic-text flex items-center">
                <Heart className="w-8 h-8 ml-3 fill-current" />
                المفضلة
              </h1>
              <p className="text-red-100 arabic-text">
                أذكارك المحفوظة للوصول السريع
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {favorites.length}
              </div>
              <div className="text-sm text-red-100">
                ذكر محفوظ
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      {favorites.length > 0 && (
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المفضلة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent arabic-text"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 ml-2 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 arabic-text">تصفية:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`
                    px-3 py-1 rounded-lg text-sm font-medium transition-colors arabic-text
                    ${filterCategory === category
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {getCategoryIcon(category)} {getCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          <div className="flex justify-end">
            <button
              onClick={clearAllFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="arabic-text">حذف جميع المفضلة</span>
            </button>
          </div>
        </div>
      )}

      {/* Favorites List */}
      {filteredAdhkar.length > 0 ? (
        <div className="space-y-6">
          {filteredAdhkar.map((dhikr, index) => (
            <div key={dhikr.id} className="relative">
              {/* Category Badge */}
              <div className="absolute -right-3 -top-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium z-10">
                {getCategoryIcon(dhikr.category)} {getCategoryName(dhikr.category)}
              </div>
              
              <DhikrCard
                dhikr={dhikr}
                onFavorite={handleFavorite}
                isFavorite={true}
              />
            </div>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        // No results from search/filter
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2 arabic-text">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 dark:text-gray-500 arabic-text">
            جرب تغيير كلمات البحث أو الفلتر
          </p>
        </div>
      ) : (
        // No favorites at all
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2 arabic-text">
            لا توجد أذكار محفوظة
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6 arabic-text">
            ابدأ بإضافة أذكارك المفضلة من الصفحات الأخرى
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/morning"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
            >
              ☀️ <span className="arabic-text">أذكار الصباح</span>
            </Link>
            
            <Link
              href="/evening"
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
            >
              🌙 <span className="arabic-text">أذكار المساء</span>
            </Link>
            
            <Link
              href="/general"
              className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
            >
              📿 <span className="arabic-text">الأذكار العامة</span>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-gray-600 dark:text-gray-300 arabic-text mb-2">
          &ldquo;وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ&rdquo;
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          سورة الأنفال - آية 45
        </p>
      </div>
    </div>
  )
}
