import { useEffect, useState } from 'react'
import { Auth } from './components/Auth'
import { SwipeDeck } from './components/SwipeDeck'
import { Matches } from './components/Matches'
import { Chat } from './components/Chat'
import { api, getToken } from './lib/api'

function App() {
  const [authed, setAuthed] = useState(!!getToken())
  const [tab, setTab] = useState('home')
  const [me, setMe] = useState(null)
  const [chatMatch, setChatMatch] = useState(null)

  const loadMe = async () => {
    try {
      const data = await api.me()
      setMe(data)
    } catch (e) {}
  }

  useEffect(() => { if (authed) loadMe() }, [authed])

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-6">
        <Auth onAuthed={() => setAuthed(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <header className="p-4 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-amber-600">Spark</div>
        <nav className="flex gap-3">
          <button onClick={() => setTab('home')} className={`px-3 py-1 rounded-full ${tab==='home'?'bg-amber-500 text-white':'bg-white text-amber-600'}`}>Discover</button>
          <button onClick={() => setTab('matches')} className={`px-3 py-1 rounded-full ${tab==='matches'?'bg-amber-500 text-white':'bg-white text-amber-600'}`}>Matches</button>
          <button onClick={() => setTab('profile')} className={`px-3 py-1 rounded-full ${tab==='profile'?'bg-amber-500 text-white':'bg-white text-amber-600'}`}>Profile</button>
        </nav>
      </header>

      <main className="max-w-xl mx-auto p-4">
        {tab === 'home' && (
          <SwipeDeck onMatched={(id)=>{ setTab('matches') }} />
        )}
        {tab === 'matches' && !chatMatch && (
          <Matches onOpenChat={(m)=>{ setChatMatch(m) }} />
        )}
        {tab === 'matches' && chatMatch && (
          <div className="h-[75vh]"><Chat match={chatMatch} onBack={()=>setChatMatch(null)} /></div>
        )}
        {tab === 'profile' && (
          <div className="bg-white/80 rounded-2xl p-4 shadow space-y-4">
            <div className="text-lg font-semibold">My Profile</div>
            <div className="text-sm text-gray-600">Name: {me?.user?.name}</div>
            <div className="text-sm text-gray-600">Email: {me?.user?.email}</div>
            <div className="text-sm text-gray-600">Discovery: {me?.profile?.pref_show} • within {me?.profile?.pref_max_distance_km} km</div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-amber-700">© Spark</footer>
    </div>
  )
}

export default App
