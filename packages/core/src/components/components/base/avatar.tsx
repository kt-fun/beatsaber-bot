import React from 'react'

interface AvatarProps {
  className?: string
  src: string
  fallback?: string
}
export function Avatar({ src, fallback, className }: AvatarProps) {
  return <img className={className} src={src} loading={'eager'}/>
}
