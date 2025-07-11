'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Heart, 
  Settings,
  Clock,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('صباح الخير')
    } else if (hour >= 12 && hour < 17) {
      setGreeting('مساء الخير')
    } else if (hour >= 17 && hour < 21) {
      setGreeting('مساء الخير')
    } else {
      setGreeting('ليلة مباركة')
    }
  }, [currentTime])

  const menuItems = [
    {
      title: 'أذكار الصباح',
      description: 'أذكار وأدعية لبدء اليوم بطمأنينة',
      icon: Sun,
      href: '/morning',
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-white'
    },
    {
      title: 'أذكار المساء',
      description: 'أذكار لحفظ النفس مع نهاية اليوم',
      icon: Moon,
      href: '/evening',
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-white'
    },
    {
      title: 'أذكار عامة',
      description: 'أذكار متنوعة لمختلف المناسبات',
      icon: BookOpen,
      href: '/general',
      color: 'from-green-400 to-blue-500',
      textColor: 'text-white'
    },
    {
      title: 'التسبيح',
      description: 'عداد تفاعلي للتسبيح والذكر',
      icon: Sparkles,
      href: '/tasbih',
      color: 'from-pink-400 to-red-500',
      textColor: 'text-white'
    },
    {
      title: 'المفضلة',
      description: 'أذكارك المحفوظة للوصول السريع',
      icon: Heart,
      href: '/favorites',
      color: 'from-red-400 to-pink-500',
      textColor: 'text-white'
    },
    {
      title: 'الإعدادات',
      description: 'تخصيص التطبيق حسب تفضيلاتك',
      icon: Settings,
      href: '/settings',
      color: 'from-gray-400 to-gray-600',
      textColor: 'text-white'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        {/* App Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/icon.svg"
              alt="أذكاري"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 arabic-text">
          أذكاري
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 arabic-text">
          {greeting} - وقت الذكر والدعاء
        </p>
        <div className="flex items-center justify-center mt-4 text-gray-500 dark:text-gray-400">
          <Clock className="w-5 h-5 ml-2" />
          <span className="font-mono">
            {currentTime.toLocaleTimeString('ar-SA')}
          </span>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Link
              key={index}
              href={item.href}
              className="group block"
            >
              <div className={`
                relative overflow-hidden rounded-xl p-6 h-40
                bg-gradient-to-br ${item.color}
                transform transition-all duration-300
                hover:scale-105 hover:shadow-xl
                cursor-pointer
              `}>
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`text-xl font-bold mb-2 arabic-text ${item.textColor}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm opacity-90 arabic-text ${item.textColor}`}>
                        {item.description}
                      </p>
                    </div>
                    <IconComponent className={`w-8 h-8 ${item.textColor} opacity-80`} />
                  </div>
                  
                  <div className="flex items-center justify-end">
                    <span className={`text-sm font-medium ${item.textColor} opacity-75`}>
                      اضغط للدخول ←
                    </span>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white opacity-5 rounded-full"></div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300 arabic-text">
          &ldquo;وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ&rdquo;
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          سورة الأنفال - آية 45
        </p>
      </div>
    </div>
  )
}
