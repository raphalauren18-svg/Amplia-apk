import { Upload, ShoppingBag, Printer, DollarSign } from 'lucide-react'

const STEPS = [
  {
    Icon: Upload,
    step: '01',
    title: 'Autor publica o livro',
    desc:  'Sobe o PDF, define preço digital e físico e publica em minutos. Totalmente gratuito.',
  },
  {
    Icon: ShoppingBag,
    step: '02',
    title: 'Leitor compra',
    desc:  'O leitor encontra o livro no catálogo e compra via Pix ou cartão pela plataforma.',
  },
  {
    Icon: Printer,
    step: '03',
    title: 'Gráfica imprime sob demanda',
    desc:  'Para compras físicas, a gráfica parceira mais próxima imprime e envia diretamente.',
  },
  {
    Icon: DollarSign,
    step: '04',
    title: 'Todos recebem',
    desc:  'O lucro é dividido de forma transparente entre autor, afiliado e plataforma.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Como a Amplia funciona
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Do upload ao pagamento, tudo automatizado em 4 passos simples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ Icon, step, title, desc }) => (
            <div key={step} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                  {step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
