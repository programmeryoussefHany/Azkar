'use client'

import { useState } from 'react'
import { Heart, Share2, Copy, Check } from 'lucide-react'
import ShareModal from './ShareModal'

interface DhikrCardProps {
  dhikr: {
    id: string
    text: string
    translation?: string
    source: string
    count?: number
    benefits?: string
  }
  onFavorite?: (id: string) => void
  isFavorite?: boolean
  currentCount?: number
  onCountChange?: (id: string, count: number) => void
}

export default function DhikrCard({ dhikr, onFavorite, isFavorite = false, currentCount: externalCount, onCountChange }: DhikrCardProps) {
  const [internalCount, setInternalCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Use external count if provided, otherwise use internal count
  const currentCount = externalCount !== undefined ? externalCount : internalCount

  const handleCount = () => {
    const newCount = currentCount + 1

    if (dhikr.count && newCount <= dhikr.count) {
      if (onCountChange) {
        onCountChange(dhikr.id, newCount)
      } else {
        setInternalCount(newCount)
      }
    } else if (!dhikr.count) {
      if (onCountChange) {
        onCountChange(dhikr.id, newCount)
      } else {
        setInternalCount(newCount)
      }
    }
  }

  const resetCount = () => {
    if (onCountChange) {
      onCountChange(dhikr.id, 0)
    } else {
      setInternalCount(0)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(dhikr.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareText = () => {
    const shareContent = `${dhikr.text}\n\nالمصدر: ${dhikr.source}\n\nمن تطبيق أذكاري 🤲`

    if (navigator.share) {
      navigator.share({
        title: 'ذكر من تطبيق أذكاري',
        text: shareContent,
      })
    } else {
      setShowShareModal(true)
    }
  }

  const isCompleted = dhikr.count ? currentCount >= dhikr.count : false

  return (
    <div className={`
      dhikr-card transition-all duration-300
      ${isCompleted ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''}
    `}>
      {/* Main Dhikr Text */}
      <div className="arabic-text dhikr-text text-xl leading-loose">
        {dhikr.text}
      </div>

      {/* Translation */}
      {dhikr.translation && (
        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 italic">
          {dhikr.translation}
        </div>
      )}

      {/* Benefits */}
      {dhikr.benefits && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1 arabic-text">
            الفوائد:
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 arabic-text">
            {dhikr.benefits}
          </p>
        </div>
      )}

      {/* Count Section */}
      {dhikr.count && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={handleCount}
              disabled={isCompleted}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${isCompleted 
                  ? 'bg-green-500 text-white cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
            >
              {isCompleted ? '✓ مكتمل' : 'سبح'}
            </button>
            
            {currentCount > 0 && (
              <button
                onClick={resetCount}
                className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                إعادة تعيين
              </button>
            )}
          </div>
          
          <div className="text-right">
            <div className="dhikr-count">
              {currentCount} / {dhikr.count}
            </div>
            {isCompleted && (
              <div className="text-green-600 dark:text-green-400 text-xs font-medium">
                مبارك! تم الانتهاء
              </div>
            )}
          </div>
        </div>
      )}

      {/* Source */}
      <div className="dhikr-source mb-4 arabic-text">
        المصدر: {dhikr.source}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => onFavorite?.(dhikr.id)}
            className={`
              p-2 rounded-lg transition-colors
              ${isFavorite 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }
            `}
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            aria-label="نسخ النص"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          
          <button
            onClick={shareText}
            className="p-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            aria-label="مشاركة"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-xs text-gray-400 dark:text-gray-500">
          اضغط للتفاعل
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        content={`${dhikr.text}\n\nالمصدر: ${dhikr.source}\n\nمن تطبيق أذكاري 🤲`}
        title="مشاركة الذكر"
      />
    </div>
  )
}
