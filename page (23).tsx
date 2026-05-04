import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'

export default function TermosPage() {
  const lastUpdate = '17 de abril de 2025'

  return (
    <>
      <Navbar forceDark />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">Termos de Uso</h1>
            <p className="text-gray-400 text-sm">Última atualização: {lastUpdate}</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-10 text-gray-600 leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar ou utilizar a plataforma Amplia ("Plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p>
                A Amplia é uma plataforma SaaS brasileira que conecta autores independentes, afiliados, gráficas parceiras e leitores, viabilizando a publicação, distribuição e venda de livros digitais e físicos sob demanda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cadastro e Conta</h2>
              <p>
                Para utilizar os recursos da Plataforma, é necessário criar uma conta fornecendo informações verdadeiras e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas sob sua conta.
              </p>
              <p className="mt-3">
                A Amplia se reserva o direito de encerrar contas que violem estes Termos, utilizem informações falsas ou realizem atividades fraudulentas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Direitos dos Autores</h2>
              <p>
                Ao publicar conteúdo na Amplia, o autor declara ser o titular legítimo dos direitos autorais da obra ou possuir autorização expressa para tal. O autor cede à Amplia uma licença não exclusiva para distribuição e comercialização do conteúdo na Plataforma.
              </p>
              <p className="mt-3">
                O autor permanece titular de todos os direitos autorais sobre sua obra. A Amplia não reivindica propriedade sobre o conteúdo publicado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Distribuição de Receita</h2>
              <p>
                A distribuição de receita entre autores, afiliados, gráficas parceiras e a plataforma é definida nas configurações da Amplia e comunicada de forma transparente no painel de cada usuário. Os percentuais vigentes estão disponíveis no painel administrativo e podem ser consultados a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Pagamentos e Reembolsos</h2>
              <p>
                Todos os pagamentos são processados via PIX através do gateway Asaas. Após a confirmação do pagamento, o acesso ao conteúdo digital é liberado automaticamente. Para livros físicos, o prazo de entrega varia conforme a localização e a gráfica parceira responsável.
              </p>
              <p className="mt-3">
                Reembolsos podem ser solicitados em até 7 dias após a compra para produtos digitais com defeito comprovado, conforme o Código de Defesa do Consumidor brasileiro.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Conteúdo Proibido</h2>
              <p>É expressamente proibido publicar na Plataforma conteúdo que:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Viole direitos autorais de terceiros</li>
                <li>Contenha discurso de ódio, discriminação ou incitação à violência</li>
                <li>Seja pornográfico ou envolva menores de idade</li>
                <li>Promova atividades ilegais</li>
                <li>Seja enganoso ou fraudulento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p>
                A Amplia não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do uso da Plataforma. Nossa responsabilidade total está limitada ao valor pago pelo usuário nos últimos 12 meses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Alterações nos Termos</h2>
              <p>
                A Amplia pode modificar estes Termos a qualquer momento. Notificaremos os usuários sobre alterações relevantes por e-mail ou mediante aviso na Plataforma. O uso continuado dos serviços após a notificação constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Lei Aplicável</h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será submetida ao foro da Comarca de São Paulo, SP.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contato</h2>
              <p>
                Dúvidas sobre estes Termos podem ser enviadas para{' '}
                <a href="mailto:contato@amplia.com.br" className="text-[#0D1B8E] font-medium hover:underline">
                  contato@amplia.com.br
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
