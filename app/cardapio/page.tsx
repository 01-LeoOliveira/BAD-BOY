'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import espetinhos from '../../data/espetinhos.json'
import bebidas from '../../data/bebidas.json'
import hamburguer from '../../data/hamburguer.json'
import pratos from '../../data/pratos.json'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Home } from 'lucide-react'

interface CartItem {
  id: number
  nome: string
  preco: number
  quantidade: number
  tamanho?: string
}

interface QuantityState {
  quantidade: number
  tamanho?: string
}

interface SectionQuantities {
  [key: number]: QuantityState
}

function CardapioContent() {
  const searchParams = useSearchParams()
  const [carrinho, setCarrinho] = useState<CartItem[]>(() => {
    const carrinhoParam = searchParams.get('carrinho')
    if (carrinhoParam) {
      try {
        return JSON.parse(carrinhoParam)
      } catch (error) {
        console.error('Erro ao parsear o carrinho:', error)
        return []
      }
    }
    return []
  })

  const [quantities, setQuantities] = useState<{
    [key: string]: SectionQuantities
  }>({
    espetinhos: espetinhos.espetos.reduce<SectionQuantities>((acc, item) => {
      acc[item.id] = { quantidade: 1, tamanho: 'Simples' }
      return acc
    }, {}),
    bebidas: {},
    hamburgueres: {},
    pratosDoDia: {},
    porcoes: {},
    sobremesas: {}
  })

  const updateQuantity = (
    section: string,
    itemId: number,
    quantidade: number,
    tamanho?: string
  ) => {
    setQuantities(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [itemId]: { quantidade, tamanho }
      }
    }))
  }

  const addToCart = (
    item: any,
    section: string
  ) => {
    const itemDetails = quantities[section][item.id] || { quantidade: 1 }
    let cartItem: CartItem = {
      id: item.id,
      nome: item.nome,
      preco: section === 'espetinhos' 
        ? item.precos[itemDetails.tamanho === 'Simples' ? 'Simples' : 'Acompanhamento']
        : item.preco,
      quantidade: itemDetails.quantidade,
      tamanho: itemDetails.tamanho
    }

    const updatedCart = [...carrinho]
    const existingIndex = updatedCart.findIndex(cartItem => 
      cartItem.id === item.id && cartItem.tamanho === itemDetails.tamanho
    )

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantidade += itemDetails.quantidade
    } else {
      updatedCart.push(cartItem)
    }

    setCarrinho(updatedCart)
  }

  const renderMenuItem = (item: any, section: string) => {
    const itemDetails = quantities[section][item.id] || { quantidade: 1 }
    const showTamanho = section === 'espetinhos'

    return (
      <div key={`${section}-${item.id}`} className="border rounded-lg overflow-hidden shadow-md bg-[#5d4037]/80 p-3 md:p-4 text-white">
        <Image
          src={item.imagem}
          alt={item.nome}
          width={400}
          height={300}
          className="w-full h-40 md:h-48 object-cover rounded-t-lg"
        />
        <div className="mt-2 md:mt-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#ff6f00]">
            {item.nome}
          </h2>
          
          {item.ingredientes && (
            <p className="text-sm md:text-base text-white mb-2">
              {item.ingredientes.join(', ')}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 space-y-2 sm:space-y-0">
            <span className="text-base md:text-lg font-bold text-[#e9e2dd]">
              R$ {(showTamanho 
                ? item.precos[itemDetails.tamanho === 'Simples' ? 'Simples' : 'Acompanhamento']
                : item.preco
              ).toFixed(2)}
            </span>

            {showTamanho && (
              <select
                value={itemDetails.tamanho || 'Simples'}
                onChange={(e) => {
                  updateQuantity(
                    section,
                    item.id,
                    itemDetails.quantidade,
                    e.target.value as 'Simples' | 'Acompanhamento (completo)'
                  )
                }}
                className="border rounded px-2 py-1 text-sm w-full sm:w-auto bg-[#4a2c2a] text-white"
              >
                {item.tamanhos.map((tamanho: string) => (
                  <option key={tamanho} value={tamanho}>
                    {tamanho}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="number"
              min="1"
              value={itemDetails.quantidade}
              onChange={(e) => {
                updateQuantity(
                  section,
                  item.id,
                  parseInt(e.target.value),
                  itemDetails.tamanho
                )
              }}
              className="w-full sm:w-16 border rounded px-2 py-1 text-center text-sm bg-[#4a2c2a] text-white"
            />
            <button
              onClick={() => addToCart(item, section)}
              className="w-full sm:flex-1 bg-[#ff6f00] text-white py-2 rounded hover:bg-[#ff8f00] text-sm"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    )
  }

  const valorTotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0)

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
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 bg-[#ff6f00] text-white p-3 rounded-full shadow-lg hover:bg-[#ff8f00] flex items-center"
      >
        <Home className="w-4 h-4 md:w-6 md:h-6" />
      </Link>
      
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 container mx-auto px-2 md:px-4 py-4 md:py-8 min-h-screen">
        {carrinho.length > 0 && (
          <Link
            href={{
              pathname: '/pedidos',
              query: { carrinho: JSON.stringify(carrinho) }
            }}
            className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 bg-[#ff6f00] text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-[#ff8f00] flex items-center text-sm md:text-base"
          >
            <ShoppingCart className="mr-1 md:mr-2 w-4 h-4 md:w-6 md:h-6" />
            {carrinho.length} | R$ {valorTotal.toFixed(2)}
          </Link>
        )}

        {/* Hamburgueres */}
        <div className="p-4 md:p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-[#ff6f00]">
            Hamburgueres
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {hamburguer.burguers.map(burger => renderMenuItem(burger, 'hamburgueres'))}
          </div>
        </div>

        {/* Espetinhos */}
        <div className="p-4 md:p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-[#ff6f00]">
            Nossos Espetinhos
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {espetinhos.espetos.map(espetinho => renderMenuItem(espetinho, 'espetinhos'))}
          </div>
        </div>

        {/* Pratos do Dia */}
        <div className="p-4 md:p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-[#ff6f00]">
            Pratos do Dia
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {pratos.pratos_do_dia.map(prato => renderMenuItem(prato, 'pratosDoDia'))}
          </div>
        </div>

        {/* Porções */}
        <div className="p-4 md:p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-[#ff6f00]">
            Porções
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {pratos.porcoes.map(porcao => renderMenuItem(porcao, 'porcoes'))}
          </div>
        </div>

        {/* Bebidas */}
        <div className="p-4 md:p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-[#ff6f00]">
            Nossas Bebidas
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {bebidas.bebidas.map(bebida => renderMenuItem(bebida, 'bebidas'))}
          </div>
        </div>

        {/* Sobremesas */}
        <div className="p-4 md:p-6 rounded-2xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center text-[#ff6f00]">
            Sobremesas
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {pratos.sobremesas.map(sobremesa => renderMenuItem(sobremesa, 'sobremesas'))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cardapio() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-white">Carregando...</div>}>
      <CardapioContent />
    </Suspense>
  )
}