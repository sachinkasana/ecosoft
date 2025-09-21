import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

L.Icon.Default.mergeOptions({ iconUrl: markerIconUrl, shadowUrl: markerShadowUrl })

type Coords = { lat: number; lng: number }

export default function MapPicker() {
  const { state } = useLocation() as { state?: { current?: Coords } }
  const nav = useNavigate()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [pos, setPos] = useState<Coords | null>(state?.current || null)

  useEffect(() => {
    const init = async () => {
      if (!mapRef.current) return
      const center = (state?.current) || { lat: 20.5937, lng: 78.9629 }
      const map = L.map(mapRef.current).setView([center.lat, center.lng], 16)
      leafletMap.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)

      const placeMarker = (c: Coords) => {
        setPos(c)
        if (markerRef.current) markerRef.current.setLatLng([c.lat, c.lng])
        else markerRef.current = L.marker([c.lat, c.lng], { draggable: true }).addTo(map)
        markerRef.current.on('dragend', () => {
          const ll = markerRef.current!.getLatLng(); setPos({ lat: ll.lat, lng: ll.lng })
        })
      }

      map.on('click', (e: any) => placeMarker({ lat: e.latlng.lat, lng: e.latlng.lng }))

      if (!state?.current && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p) => {
          const c = { lat: p.coords.latitude, lng: p.coords.longitude }
          map.setView([c.lat, c.lng], 17)
          placeMarker(c)
        })
      } else if (state?.current) {
        placeMarker(state.current)
      }
    }
    init()
    return () => { leafletMap.current?.remove(); leafletMap.current = null }
  }, [state])

  const confirm = () => { if (pos) nav('/customers/add', { replace: true, state: { coords: pos } }) }

  return (
    <div className="min-h-screen bg-white w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <header className="h-12 flex items-center gap-2 px-4 border-b">
        <button onClick={() => nav(-1)} className="text-sm underline">Back</button>
        <div className="font-medium">Pick Location</div>
      </header>
      <div ref={mapRef} className="h-[calc(100vh-4rem)] w-full" />
      <div className="p-3 border-t flex items-center justify-between">
        <div className="text-xs text-gray-600">Lat: {pos?.lat?.toFixed(6)} Lng: {pos?.lng?.toFixed(6)}</div>
        <button onClick={confirm} className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm disabled:opacity-50" disabled={!pos}>Use this location</button>
      </div>
    </div>
  )
}
