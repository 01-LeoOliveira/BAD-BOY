import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '600', '700']
})

export const metadata: Metadata = {
  title: 'BAD BOY',
  description: 'Churrascaria BAD BOY',
  icons: {
    icon: [
      { url: '/img/profile.png', sizes: '16x16', type: 'image/png' },
      { url: '/img/profile.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/img/profile.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body 
        className={`${montserrat.className} bg-[#ffcbdb] text-black`}
      >
        {children}
      </body>
    </html>
  )
}