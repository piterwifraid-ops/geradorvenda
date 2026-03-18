import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const API_TOKEN = 'FJ12qeJ6kvNVHorwBt3VB2PKMJe9cmehw0rP'
const API_ENDPOINT = 'https://api.utmify.com.br/api-credentials/orders'

export default function SalesForm() {
  const [formData, setFormData] = useState({
    value: '',
    currency: 'BRL',
    customerName: 'Cliente',
    customerEmail: 'cliente@example.com',
    customerPhone: null,
    customerDocument: null,
    customerCountry: 'BR',
    productName: 'Produto',
  })

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [history, setHistory] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateOrderData = (status) => {
    const valueInCents = Math.round(parseFloat(formData.value) * 100)
    const now = new Date()
    const createdAt = now.toISOString().replace('T', ' ').slice(0, 19)
    const approvedDate = status === 'paid' ? createdAt : null

    return {
      orderId: uuidv4(),
      platform: 'SttsApp',
      paymentMethod: 'pix',
      status: status,
      createdAt: createdAt,
      approvedDate: approvedDate,
      refundedAt: null,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone || '11999999999',
        document: formData.customerDocument || '00000000000',
        country: formData.customerCountry,
        ip: '127.0.0.1'
      },
      products: [
        {
          id: uuidv4(),
          name: formData.productName,
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: valueInCents
        }
      ],
      trackingParameters: {
        src: null,
        sck: null,
        utm_source: null,
        utm_campaign: null,
        utm_medium: null,
        utm_content: null,
        utm_term: null
      },
      commission: {
        totalPriceInCents: valueInCents,
        gatewayFeeInCents: Math.round(valueInCents * 0.02),
        userCommissionInCents: Math.round(valueInCents * 0.98),
        currency: formData.currency
      },
      isTest: false
    }
  }

  const sendOrder = async (status) => {
    if (!formData.value || parseFloat(formData.value) <= 0) {
      setFeedback({
        type: 'error',
        message: 'Por favor, informe um valor válido'
      })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      const orderData = generateOrderData(status)
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'x-api-token': API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (response.ok) {
        setFeedback({
          type: 'success',
          message: `Venda ${status === 'waiting_payment' ? 'gerada' : 'paga'} com sucesso!`
        })
        setHistory(prev => [{
          id: orderData.orderId,
          status: status,
          value: formData.value,
          currency: formData.currency,
          timestamp: new Date().toLocaleString('pt-BR')
        }, ...prev])
      } else {
        setFeedback({
          type: 'error',
          message: `Erro: ${data.message || 'Falha ao registrar venda'}`
        })
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `Erro de conexão: ${error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Messages */}
      {feedback && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          feedback.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span className="text-2xl">
            {feedback.type === 'success' ? '✓' : '✕'}
          </span>
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      {/* Form Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor da Venda
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="0,00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Moeda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="BRL">BRL - Real</option>
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - Dólar</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome do Cliente
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email do Cliente
          </label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nome do Produto
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => sendOrder('waiting_payment')}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? '⏳ Processando...' : '📋 Venda Gerada'}
        </button>

        <button
          onClick={() => sendOrder('paid')}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? '⏳ Processando...' : '✅ Venda Paga'}
        </button>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico de Vendas</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <div key={item.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.value} {item.currency} - {item.status === 'waiting_payment' ? '📋 Gerada' : '✅ Paga'}
                    </p>
                    <p className="text-gray-500 text-xs">{item.timestamp}</p>
                  </div>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                    {item.id.slice(0, 8)}...
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold text-blue-900 mb-2">ℹ️ Como funciona:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-800">
          <li><strong>Venda Gerada:</strong> Registra uma venda em estado de espera de pagamento (waiting_payment)</li>
          <li><strong>Venda Paga:</strong> Registra uma venda já paga (paid)</li>
          <li>Os dados são enviados para a API UTMify em tempo real</li>
          <li>Suporta múltiplas moedas: BRL, EUR, USD, etc.</li>
        </ul>
      </div>
    </div>
  )
}
