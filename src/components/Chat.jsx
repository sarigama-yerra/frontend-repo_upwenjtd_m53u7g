import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'

export function Chat({ match, onBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const listRef = useRef(null)

  const load = async () => {
    try {
      const { messages } = await api.messages(match.id)
      setMessages(messages)
      setTimeout(() => listRef.current?.scrollTo(0, 999999), 50)
    } catch (e) {}
  }

  useEffect(() => { load(); const i = setInterval(load, 3000); return () => clearInterval(i) }, [match?.id])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await api.sendMessage(match.id, text.trim())
    setText('')
    await load()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3">
        <button onClick={onBack} className="text-amber-600">←</button>
        <img className="h-8 w-8 rounded-full object-cover" src={match.other_profile?.photos?.[0] || `https://source.unsplash.com/random/200x200?face&sig=${match.other_profile?.user_id}`} />
        <div className="font-semibold">{match.other_profile?.display_name || 'Chat'}</div>
      </div>
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2 bg-white/40 rounded-xl">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[70%] px-3 py-2 rounded-2xl ${m.sender_id === match.other_profile?.user_id ? 'bg-white self-start' : 'bg-amber-500 text-white self-end ml-auto'}`}>{m.content}</div>
        ))}
      </div>
      <form onSubmit={send} className="p-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded-full px-4 py-2" placeholder="Message" />
        <button className="bg-amber-500 text-white rounded-full px-4 py-2">Send</button>
      </form>
    </div>
  )
}
