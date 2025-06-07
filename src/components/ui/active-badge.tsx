import React from 'react'

interface ActiveBadgeProps {
  isActive: boolean
}

export function ActiveBadge({ isActive }: ActiveBadgeProps) {
  return (
    <span className={isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
      {isActive ? 'Da' : 'Nu'}
    </span>
  )
}
