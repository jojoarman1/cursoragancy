import { Chat } from '@/components/layout/Chat'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <Chat />
    </>
  )
}
