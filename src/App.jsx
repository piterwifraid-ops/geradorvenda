import { useState } from 'react'
import SalesForm from './components/SalesForm'

export default function App() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            UTMify Sales Integration
          </h1>
          <p className="text-gray-600 mb-8">
            Integração com API UTMify para registrar vendas geradas e pagas
          </p>
          
          <SalesForm />
        </div>
      </div>
    </div>
  )
}
