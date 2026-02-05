import { FC } from 'react'

interface ArcadeGlyphProps {
  className?: string
}

export const ArcadeGlyph: FC<ArcadeGlyphProps> = ({
  className = 'w-10 h-10',
}) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={1.6}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='8.5' />
    <circle cx='12' cy='12' r='2.6' fill='currentColor' opacity='0.18' />
    <path d='M12 3.8v3.4M12 16.8v3.4M3.8 12h3.4M16.8 12h3.4' />
    <path d='M8.2 8.2l2.4 2.4M13.4 13.4l2.4 2.4M15.8 8.2l-2.4 2.4M10.6 13.4l-2.4 2.4' />
  </svg>
)
