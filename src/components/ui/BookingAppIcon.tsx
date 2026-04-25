import { SiAirbnb, SiTripadvisor } from 'react-icons/si'
import type { BookingAppIcon as BookingAppIconKey } from '../../data/types'

interface BookingAppIconProps {
  iconKey?: BookingAppIconKey
  size?: number
  className?: string
}

export default function BookingAppIcon({ iconKey, size = 20, className = '' }: BookingAppIconProps) {
  switch (iconKey) {
    case 'airbnb':
      return <SiAirbnb size={size} className={className} />
    case 'tripadvisor':
      return <SiTripadvisor size={size} className={className} />
    case 'getyourguide':
      return (
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className={className}
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M32 4C16.5 4 4 16.5 4 32s12.5 28 28 28 28-12.5 28-28S47.5 4 32 4zm0 49c-11.6 0-21-9.4-21-21s9.4-21 21-21 21 9.4 21 21-9.4 21-21 21z" />
          <path d="M34 21h-4c-6 0-11 5-11 11s5 11 11 11c4 0 7.5-2 9.5-5l-4.5-3c-1 1.5-3 2.5-5 2.5-3.5 0-6.5-3-6.5-6.5s3-6.5 6.5-6.5h.5v4.5h-4v4h11V21z" />
        </svg>
      )
    case 'viator':
      return (
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className={className}
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M12 14h8l12 28 12-28h8L37 50h-10z" />
        </svg>
      )
    default:
      return null
  }
}
