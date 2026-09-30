import { Chat } from '@/components/layout/Chat'
import { Header } from '@/components/layout/Header'

export default function MainLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Chat />
    </>
  )
}
