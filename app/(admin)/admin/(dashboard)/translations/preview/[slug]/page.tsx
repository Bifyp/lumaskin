import HomePageEditor from '@/app/(admin)/admin/(dashboard)/translations/HomePageEditor'
import AboutPageEditor from '@/app/(admin)/admin/(dashboard)/translations/AboutPageEditor'
import BookingPageEditor from '@/app/(admin)/admin/(dashboard)/translations/BookingPageEditor'
import ContactPageEditor from '@/app/(admin)/admin/(dashboard)/translations/ContactPageEditor'
import GalleryPageEditor from '@/app/(admin)/admin/(dashboard)/translations/GalleryPageEditor'
import LoginPageEditor from '@/app/(admin)/admin/(dashboard)/translations/LoginPageEditor'
import RegisterPageEditor from '@/app/(admin)/admin/(dashboard)/translations/RegisterPageEditor'
import { ForgotPasswordPageEditor, PackagesPageEditor, ServicesPageEditor } from '@/app/(admin)/admin/(dashboard)/translations/OtherPageEditors'
import { notFound } from 'next/navigation'
import { use } from 'react'

const EDITORS: Record<string, React.ComponentType> = {
  homepage: HomePageEditor,
  about: AboutPageEditor,
  booking: BookingPageEditor,
  contact: ContactPageEditor,
  gallery: GalleryPageEditor,
  login: LoginPageEditor,
  register: RegisterPageEditor,
  'forgot-password': ForgotPasswordPageEditor,
  packages: PackagesPageEditor,
  services: ServicesPageEditor,
}

export const dynamic = 'force-dynamic'

export default function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const Editor = EDITORS[slug]
  if (!Editor) notFound()
  return <Editor />
}