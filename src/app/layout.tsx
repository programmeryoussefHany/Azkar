import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'أذكاري - تطبيق الأذكار الإسلامي',
  description: 'تطبيق شامل للأذكار الإسلامية اليومية مع أذكار الصباح والمساء والتسبيح',
  keywords: 'أذكار، إسلام، تسبيح، دعاء، قرآن، سنة، أذكار الصباح، أذكار المساء، حصن المسلم',
  authors: [{ name: 'أذكاري' }],
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'أذكاري'
  },
  openGraph: {
    title: 'أذكاري - تطبيق الأذكار الإسلامي',
    description: 'تطبيق شامل للأذكار الإسلامية اليومية مع أذكار الصباح والمساء والتسبيح',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'أذكاري'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أذكاري - تطبيق الأذكار الإسلامي',
    description: 'تطبيق شامل للأذكار الإسلامية اليومية مع أذكار الصباح والمساء والتسبيح'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#228B22" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="أذكاري" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
