'use client'

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  title?: string
}

export default function ShareModal({ isOpen, onClose, content, title = 'مشاركة الذكر' }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const encodedContent = encodeURIComponent(content)
  
  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodedContent}`,
    telegram: `https://t.me/share/url?text=${encodedContent}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedContent}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodedContent}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodedContent}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const shareOptions = [
    {
      name: 'واتساب',
      icon: '📱',
      url: shareUrls.whatsapp,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30'
    },
    {
      name: 'تيليجرام',
      icon: '✈️',
      url: shareUrls.telegram,
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30'
    },
    {
      name: 'تويتر',
      icon: '🐦',
      url: shareUrls.twitter,
      color: 'bg-sky-100 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/30'
    },
    {
      name: 'فيسبوك',
      icon: '📘',
      url: shareUrls.facebook,
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/30'
    },
    {
      name: 'لينكد إن',
      icon: '💼',
      url: shareUrls.linkedin,
      color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/30'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold arabic-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400 arabic-text leading-relaxed">
              {content}
            </p>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6">
          <div className="space-y-3">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${option.color}`}
                onClick={() => {
                  // Small delay to allow the link to open before closing modal
                  setTimeout(onClose, 100)
                }}
              >
                <span className="text-xl">{option.icon}</span>
                <span className="arabic-text font-medium">{option.name}</span>
              </a>
            ))}

            {/* Copy to Clipboard */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              <span className="arabic-text font-medium">
                {copied ? 'تم النسخ!' : 'نسخ النص'}
              </span>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors arabic-text font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
