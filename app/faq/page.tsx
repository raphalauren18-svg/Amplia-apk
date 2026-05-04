import { redirect } from 'next/navigation'

// /faq redireciona para /ajuda que tem o conteúdo completo
export default function FaqPage() {
  redirect('/ajuda')
}
