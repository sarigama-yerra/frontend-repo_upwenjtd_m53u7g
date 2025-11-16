import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'

function Card({ profile, onSwipe }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState({ x: 0, y: 0, down: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0, startY = 0

    const onPointerDown = (e) => {
      setDrag((d) => ({ ...d, down: true }))
      startX = e.clientX
      startY = e.clientY
    }
    const onPointerMove = (e) => {
      if (!drag.down) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      setDrag((d) => ({ ...d, x: dx, y: dy }))
    }
    const onPointerUp = () => {
      const threshold = 120
      if (drag.x > threshold) onSwipe('like')
      else if (drag.x < -threshold) onSwipe('dislike')
      else setDrag({ x: 0, y: 0, down: false })
      setDrag({ x: 0, y: 0, down: false })
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [drag.down, drag.x])

  const rotate = drag.x / 15
  const likeOpacity = Math.max(0, Math.min(1, drag.x / 120))
  const nopeOpacity = Math.max(0, Math.min(1, -drag.x / 120))

  return (
    <div ref={ref} className="absolute inset-0 touch-none select-none" style={{ transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotate}deg)`, transition: drag.down ? 'none' : 'transform 0.25s ease' }}>
      <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-200 relative">
        <img src={profile?.photos?.[0] || `https://source.unsplash.com/random/800x1000?person&sig=${profile?.user_id}`}
             alt={profile?.display_name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="text-2xl font-bold">{profile?.display_name || 'Name'}, {profile?.age || ''}</div>
          {profile?.job_title && <div className="text-sm opacity-90">{profile.job_title}</div>}
        </div>
        <div className="absolute top-4 left-4 text-4xl font-extrabold text-green-500" style={{ opacity: likeOpacity }}>LIKE</div>
        <div className="absolute top-4 right-4 text-4xl font-extrabold text-rose-500" style={{ opacity: nopeOpacity }}>NOPE</div>
      </div>
    </div>
  )
}

export function SwipeDeck({ onMatched }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { profiles } = await api.feed(20)
      setProfiles(profiles)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSwipe = async (action) => {
    if (!profiles.length) return
    const [top, ...rest] = profiles
    setProfiles(rest)
    try {
      const res = await api.swipe(top.user_id, action)
      if (res?.match_created) onMatched(res.match_id)
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="text-center text-gray-600">Loading…</div>
  if (!profiles.length) return (
    <div className="text-center text-gray-600">
      No more profiles nearby. Check back later.
    </div>
  )

  return (
    <div className="relative h-[70vh]">
      {profiles.slice(0, 3).reverse().map((p, idx) => (
        <Card key={p.id || p.user_id} profile={p} onSwipe={handleSwipe} />
      ))}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button onClick={() => handleSwipe('dislike')} className="h-12 w-12 rounded-full bg-white shadow flex items-center justify-center text-rose-500 text-2xl">×</button>
        <button onClick={() => handleSwipe('like')} className="h-14 w-14 rounded-full bg-amber-500 text-white shadow flex items-center justify-center text-2xl">♥</button>
      </div>
    </div>
  )
}
