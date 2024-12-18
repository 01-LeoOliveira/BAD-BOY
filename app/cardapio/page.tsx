'use client'

import { useState } from 'react'
import espetinhos from '../../data/espetinhos.json'
import bebidas from '../../data/bebidas.json'
import hamburguer from '../../data/hamburguer.json'
import pratos from '../../data/pratos.json'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Home, Trash2, Plus, Minus } from 'lucide-react'
import { Suspense } from 'react'

interface CartItem {
  id: number
  nome: string
  preco: number
  quantidade: number
  tamanho?: string
  sabor?: string
}

interface QuantityState {
  quantidade: number
  tamanho?: string
  sabor?: string
}

interface SectionQuantities {
  [key: number]: QuantityState
}

interface MenuItem {
  id: number
  nome: string
  preco?: number
  precos?: { Simples: number; Acompanhamento: number }
  imagem: string
  descricao?: string
  ingredientes?: string[]
  opcoes?: string[]
  sabores?: string[]
}

function CardapioContent() {
  const [carrinho, setCarrinho] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCarrinho = localStorage.getItem('carrinho')
      if (savedCarrinho) {
        try {
          return JSON.parse(savedCarrinho)
        } catch (error) {
          console.error('Erro ao parsear o carrinho do localStorage:', error)
          return []
        }
      }
    }
    return []
  })

  // Função para remover item do carrinho
  const removeFromCart = (index: number) => {
    const newCarrinho = carrinho.filter((_, i) => i !== index)
    setCarrinho(newCarrinho)
    localStorage.setItem('carrinho', JSON.stringify(newCarrinho))
  }

  // Função para validar e calcular o preço correto
  const calculatePrice = (item: MenuItem, section: string, tamanho?: string): number => {
    if (section === 'espetinhos' && item.precos) {
      return tamanho === 'Simples' ? item.precos.Simples : item.precos.Acompanhamento
    }
    return item.preco || 0
  }

  // Função para validar quantidade
  const validateQuantity = (quantidade: number): number => {
    if (isNaN(quantidade) || quantidade < 1) {
      return 1
    }
    return Math.floor(quantidade) // Garante que seja um número inteiro
  }

  const [quantities, setQuantities] = useState<{
    [key: string]: SectionQuantities
  }>({
    espetinhos: {},
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
    tamanho?: string,
    sabor?: string
  ) => {
    const validatedQuantity = validateQuantity(quantidade)
    setQuantities(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [itemId]: { quantidade: validatedQuantity, tamanho, sabor }
      }
    }))
  }

  const addToCart = (
    item: MenuItem,
    section: string
  ) => {
    const itemDetails = quantities[section][item.id] || { quantidade: 1 }
    const validatedQuantity = validateQuantity(itemDetails.quantidade)
    const validatedPrice = calculatePrice(item, section, itemDetails.tamanho)

    const cartItem: CartItem = {
      id: item.id,
      nome: section === 'bebidas'
        ? `${item.nome} - ${itemDetails.sabor || item.opcoes?.[0] || item.sabores?.[0]}`
        : section === 'espetinhos'
          ? `${item.nome} - ${itemDetails.tamanho || 'Simples'}`
          : item.nome,
      preco: validatedPrice,
      quantidade: validatedQuantity,
      tamanho: itemDetails.tamanho || 'Simples',
      sabor: itemDetails.sabor || item.opcoes?.[0] || item.sabores?.[0]
    }

    const updatedCart = [...carrinho]
    const existingIndex = updatedCart.findIndex(existingItem =>
      existingItem.id === item.id &&
      existingItem.tamanho === itemDetails.tamanho &&
      existingItem.sabor === itemDetails.sabor
    )

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantidade += validatedQuantity
    } else {
      updatedCart.push(cartItem)
    }

    setCarrinho(updatedCart)
    localStorage.setItem('carrinho', JSON.stringify(updatedCart))
  }

  const renderMenuItem = (item: MenuItem, section: string) => {
    const itemDetails = quantities[section][item.id] || {
      quantidade: 1,
      tamanho: 'Simples',
      sabor: item.opcoes?.[0] || item.sabores?.[0]
    }
    const showTamanho = section === 'espetinhos'
    const showSabor = section === 'bebidas'

    const calcPrice = () => {
      return calculatePrice(item, section, itemDetails.tamanho)
    }

    const handleQuantityChange = (newQuantity: number) => {
      updateQuantity(
        section,
        item.id,
        newQuantity,
        itemDetails.tamanho,
        itemDetails.sabor
      )
    }

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

          {item.descricao && (
            <p className="text-sm md:text-base text-white/80 mb-2">
              {item.descricao}
            </p>
          )}

          {item.ingredientes && (
            <p className="text-sm md:text-base text-white mb-2">
              {item.ingredientes.join(', ')}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mb-2 space-y-2 sm:space-y-0">
            <span className="text-base md:text-lg font-bold text-[#e9e2dd]">
              R$ {calcPrice().toFixed(2)}
            </span>

            {showTamanho && (
              <select
                value={itemDetails.tamanho || 'Simples'}
                onChange={(e) => {
                  updateQuantity(
                    section,
                    item.id,
                    itemDetails.quantidade,
                    e.target.value,
                    itemDetails.sabor
                  )
                }}
                className="border rounded px-2 py-1 text-sm w-full sm:w-auto bg-[#4a2c2a] text-white"
              >
                <option value="Simples">Simples</option>
                <option value="Acompanhamento (completo)">Acompanhamento (completo)</option>
              </select>
            )}

            {showSabor && (
              <select
                value={itemDetails.sabor || ''}
                onChange={(e) => {
                  updateQuantity(
                    section,
                    item.id,
                    itemDetails.quantidade,
                    itemDetails.tamanho,
                    e.target.value
                  )
                }}
                className="border rounded px-2 py-1 text-sm w-full sm:w-auto bg-[#4a2c2a] text-white"
              >
                {(item.opcoes || item.sabores)?.map((sabor: string) => (
                  <option key={sabor} value={sabor}>
                    {sabor}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => handleQuantityChange(Math.max(1, itemDetails.quantidade - 1))}
                className="bg-[#4a2c2a] text-white p-2 rounded hover:bg-[#3a1c1a]"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="1"
                value={itemDetails.quantidade}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="w-16 border rounded px-2 py-1 text-center text-sm bg-[#4a2c2a] text-white"
              />

              <button
                onClick={() => handleQuantityChange(itemDetails.quantidade + 1)}
                className="bg-[#4a2c2a] text-white p-2 rounded hover:bg-[#3a1c1a]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

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

  const valorTotal = carrinho.reduce((total, item) => {
    const itemPrice = Number(item.preco) || 0
    const itemQuantity = validateQuantity(item.quantidade)
    return total + (itemPrice * itemQuantity)
  }, 0)

  // Mini carrinho flutuante
  const renderMiniCart = () => {
    if (carrinho.length === 0) return null

    return (
      <div className="fixed bottom-16 right-4 md:right-6 z-40 bg-[#5d4037] text-white p-4 rounded-lg shadow-lg max-w-sm w-full md:w-96 max-h-96 overflow-y-auto">
        <h3 className="font-bold mb-2">Itens no Carrinho:</h3>
        {carrinho.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2 border-b border-white/20 pb-2">
            <div>
              <p className="text-sm">{item.nome}</p>
              <p className="text-xs">Qtd: {item.quantidade} x R$ {item.preco.toFixed(2)}</p>
            </div>
            <button
              onClick={() => removeFromCart(index)}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

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
          <>
            {renderMiniCart()}
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
          </>
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