import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export function Matches({ onOpenChat }) {
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      const { matches } = await api.matches()
      setItems(matches)
    } catch (e) {}
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-3">
      {items.map((m) => (
        <button key={m.id} onClick={() => onOpenChat(m)} className="w-full flex items-center gap-3 bg-white/80 rounded-2xl p-3 shadow">
          <img className="h-12 w-12 rounded-full object-cover" src={m.other_profile?.photos?.[0] || `https://source.unsplash.com/random/200x200?face&sig=${m.other_profile?.user_id}`} />
          <div className="text-left">
            <div className="font-semibold">{m.other_profile?.display_name || 'Someone'}</div>
            <div className="text-xs text-gray-500">Tap to chat</div>
          </div>
        </button>
      ))}
      {!items.length && <div className="text-center text-gray-600">No matches yet.</div>}
    </div>
  )
}
