'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string
}

interface Subscription {
  id: string
  status: string
  flowSubId: string | null
  plan: Plan
  payments: { id: string; amount: number; status: string; paidAt: string | null; createdAt: string }[]
}

export default function MembresiaPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      const res = await fetch('/api/payments/subscribe', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSubscription(data.subscription)
      setPlans(data.plans || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    setSubscribing(true)
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (res.ok && data.flowUrl) {
        window.location.href = data.flowUrl
      } else {
        setMessage(data.error || 'Error al procesar')
      }
    } catch {
      setMessage('Error al procesar')
    } finally {
      setSubscribing(false)
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/admin" className="text-accent hover:text-accent-hover mb-6 inline-block text-sm transition-colors">
        ← Volver al panel
      </Link>

      <div className="animate-in">
        <h1 className="text-3xl font-bold text-brand font-serif italic mb-1">Membresía</h1>
        <p className="text-muted-light text-sm uppercase tracking-[0.06em] mb-10">
          {subscription?.status === 'active' ? 'Tu membresía está activa' : 'Elige tu plan'}
        </p>
      </div>

      {message && (
        <div className="border border-accent/30 text-accent px-4 py-3 rounded-sm mb-6 text-center text-sm bg-accent/5">
          {message}
        </div>
      )}

      {/* Current subscription */}
      {subscription && subscription.status === 'active' ? (
        <div className="glass-luxe rounded-sm p-8 mb-10 glow-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-brand font-serif">{subscription.plan.name}</h2>
                <span className="bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-[0.1em]">Activa</span>
              </div>
              <p className="text-muted-light text-sm">
                {formatPrice(subscription.plan.price)}/{subscription.plan.interval === 'monthly' ? 'mes' : 'año'}
              </p>
            </div>
            <button
              onClick={() => setMessage('Próximamente: cancelar suscripción')}
              className="text-muted-light hover:text-accent text-sm underline underline-offset-4 transition-colors"
            >
              Cancelar
            </button>
          </div>

          <div className="border-t border-border/30 pt-6">
            <h3 className="text-xs font-semibold text-muted-light uppercase tracking-[0.1em] mb-3">Beneficios incluidos</h3>
            <ul className="space-y-2">
              {JSON.parse(subscription.plan.features).map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent payments */}
          {subscription.payments.length > 0 && (
            <div className="border-t border-border/30 pt-6 mt-6">
              <h3 className="text-xs font-semibold text-muted-light uppercase tracking-[0.1em] mb-3">Pagos recientes</h3>
              <div className="space-y-2">
                {subscription.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center text-sm">
                    <span className="text-muted">{new Date(payment.createdAt).toLocaleDateString('es-CL')}</span>
                    <span className={`font-medium ${payment.status === 'paid' ? 'text-accent' : 'text-muted-light'}`}>
                      {formatPrice(payment.amount)} — {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Plan selection */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-sm p-8 transition-all duration-400 ${
                plan.price > 0 ? 'glass-luxe border-accent/20 relative glow-pulse' : 'glass border-border'
              }`}
            >
              {plan.price > 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-[0.12em] shadow-lg">
                  Recomendado
                </div>
              )}
              <h3 className="text-xl font-bold text-brand font-serif mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-accent font-serif">{formatPrice(plan.price)}</span>
                {plan.price > 0 && <span className="text-muted-light text-sm ml-1">/{plan.interval === 'monthly' ? 'mes' : 'año'}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {JSON.parse(plan.features).map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing}
                className={`block w-full text-center font-semibold py-3 rounded-sm transition-all text-sm uppercase tracking-[0.1em] disabled:opacity-50 ${
                  plan.price > 0
                    ? 'bg-accent hover:bg-accent-hover text-white hover:shadow-lg hover:shadow-accent/20'
                    : 'border border-brand/20 text-brand hover:text-accent hover:border-accent/40'
                }`}
              >
                {subscribing ? 'Procesando...' : plan.price > 0 ? 'Suscribirse' : 'Comenzar gratis'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
