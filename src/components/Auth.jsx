import { useState } from 'react'
import { api, setToken } from '../lib/api'

export function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register') {
        const { token } = await api.register(name, email, password)
        setToken(token)
      } else {
        const { token } = await api.login(email, password)
        setToken(token)
      }
      onAuthed()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Spark</h2>
        <div className="text-sm text-gray-500">{mode === 'login' ? 'Welcome back' : 'Create your account'}</div>
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'register' && (
          <input className="w-full border rounded-xl px-4 py-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        )}
        <input className="w-full border rounded-xl px-4 py-3" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-xl px-4 py-3" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl py-3 transition-colors">
          {loading ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Sign up')}
        </button>
      </form>
      <div className="text-center text-sm mt-4">
        {mode === 'login' ? (
          <button className="text-amber-600" onClick={()=>setMode('register')}>New here? Create an account</button>
        ) : (
          <button className="text-amber-600" onClick={()=>setMode('login')}>Already have an account? Log in</button>
        )}
      </div>
    </div>
  )
}
