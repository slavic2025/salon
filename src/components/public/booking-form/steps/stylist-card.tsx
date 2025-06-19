import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

interface StylistCardProps {
  stylist: Stylist
  onSelect: (stylist: Stylist) => void
}

export function StylistCard({ stylist, onSelect }: StylistCardProps) {
  return (
    <button
      onClick={() => onSelect(stylist)}
      className="group flex items-center gap-4 rounded-lg border border-gray-300 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={stylist.profile_picture || undefined} alt={stylist.full_name} />
        <AvatarFallback>{stylist.full_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{stylist.full_name}</p>
      </div>
    </button>
  )
}
