import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div 
      className="relative min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url("/img/fundo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay escuro para melhorar a legibilidade e profundidade */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="text-center bg-[#fafafa4d] p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-md text-white border-4 border-[#00000000]">
          <Image 
            src="/img/profile.png" 
            alt="BADBOY" 
            width={200} 
            height={200} 
            priority
            className="mx-auto mb-4 md:mb-6 rounded-full w-32 md:w-48 h-32 md:h-48 object-cover border-4 border-[#fafafa]"
          />
          <h1 className="animate-fire text-3xl md:text-4xl font-bold mb-2 md:mb-4 bg-gradient-to-b from-yellow-400 to-orange-600 bg-clip-text text-transparent">
            BAD BOY
          </h1>
          <p className="text-base md:text-xl mb-4 md:mb-8 text-white px-2">
            O sabor da brasa direto para sua mesa!
          </p>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              href="/cardapio" 
              className="bg-[#ff4500] text-white px-6 py-3 rounded-lg hover:bg-[#ff6347] transition text-center font-semibold transform hover:scale-105 active:scale-95"
            >
              Ver Cardápio
            </Link>
            <Link 
              href="/pedidos" 
              className="bg-[#8b0000] text-white px-6 py-3 rounded-lg hover:bg-[#a52a2a] transition text-center font-semibold transform hover:scale-105 active:scale-95"
            >
              Fazer Pedido
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}