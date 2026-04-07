import { MdTableRestaurant } from 'react-icons/md'
import { useTable } from '../../context/TableContext'

export default function TableBadge() {
  const { tableNumber, hasTable, setShowTableModal } = useTable()

  return (
    <button
      onClick={() => setShowTableModal(true)}
      className={`flex items-center gap-1 transition ${
        hasTable
          ? 'rounded-full bg-black px-2 py-1 text-brand'
          : 'text-white/50 hover:text-white/70'
      }`}
    >
      <MdTableRestaurant size={18} />
      <span className="text-[11px] sm:text-xs">
        {hasTable ? `Mesa ${tableNumber}` : 'Mesa'}
      </span>
    </button>
  )
}
