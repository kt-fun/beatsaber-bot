import React from 'react'

interface AvatarProps {
  className?: string
  src: string
  fallback?: string
}
export function Avatar({ src, fallback, className }: AvatarProps) {
  // className={'h-4 w-4 rounded-full'}
  // src={beatmap.uploader.avatar}
  // fallback={score.song.mapper.slice(0, 1)}
  return <img className={className} src={src} />
}
