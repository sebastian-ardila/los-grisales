import { useState, useEffect } from 'react'
import { MdTableRestaurant } from 'react-icons/md'
import { X, Camera, ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { useTable } from '../../context/TableContext'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useTranslation } from 'react-i18next'

type Mode = 'menu' | 'qr' | 'confirmed'

export default function TableModal({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const { tableNumber, setTableNumber, hasTable, clearTable } = useTable()
  const isMobile = useIsMobile()
  const [mode, setMode] = useState<Mode>('menu')
  const [confirmedTable, setConfirmedTable] = useState('')

  const handleSelectTable = (num: string) => {
    setTableNumber(num)
    onClose()
  }

  const handleQRSuccess = (num: string) => {
    setTableNumber(num)
    setConfirmedTable(num)
    setMode('confirmed')
  }

  useEffect(() => {
    if (mode === 'confirmed') {
      const timer = setTimeout(() => onClose(), 2000)
      return () => clearTimeout(timer)
    }
  }, [mode, onClose])

  if (mode === 'confirmed') {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 animate-fade-in">
        <div className="text-center">
          <CheckCircle size={72} className="mx-auto text-brand" weight="fill" />
          <p className="mt-4 text-xs uppercase tracking-widest text-white/60">
            {isEn ? 'Table assigned' : 'Mesa asignada'}
          </p>
          <p className="mt-2 font-display text-5xl font-bold text-white md:text-7xl">
            {confirmedTable}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-[#e8dace] p-6 text-black animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === 'menu' && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MdTableRestaurant size={24} />
                <h3 className="text-lg font-bold">
                  {isEn ? 'Select your table' : 'Selecciona tu mesa'}
                </h3>
              </div>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-black/10">
                <X size={20} />
              </button>
            </div>

            {hasTable && (
              <p className="mb-4 text-center text-sm text-black/60">
                {isEn ? 'Currently at Table' : 'Actualmente en Mesa'}{' '}
                <span className="text-xl font-bold text-black">{tableNumber}</span>
              </p>
            )}

            <div className="mb-4 grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((num) => (
                <button
                  key={num}
                  onClick={() => handleSelectTable(num)}
                  className={`h-12 rounded-xl text-lg font-bold transition ${
                    tableNumber === num
                      ? 'bg-black text-[#C4A962]'
                      : 'bg-[#C4A962]/30 text-black/70 hover:bg-[#C4A962]/50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {isMobile && (
              <button
                onClick={() => setMode('qr')}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black/10 py-3 text-sm font-medium hover:bg-black/20"
              >
                <Camera size={20} />
                {isEn ? 'Scan QR code' : 'Escanear código QR'}
              </button>
            )}

            {hasTable && (
              <button
                onClick={() => { clearTable(); onClose() }}
                className="w-full text-center text-sm text-black/40 hover:text-black/60"
              >
                {isEn ? 'Remove table' : 'Quitar mesa'}
              </button>
            )}
          </>
        )}

        {mode === 'qr' && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <button onClick={() => setMode('menu')} className="rounded-full p-1 hover:bg-black/10">
                <ArrowLeft size={20} />
              </button>
              <h3 className="text-lg font-bold">
                {isEn ? 'Scan QR' : 'Escanear QR'}
              </h3>
            </div>
            <QRScannerView onSuccess={handleQRSuccess} />
          </>
        )}
      </div>
    </div>
  )
}

function QRScannerView({ onSuccess }: { onSuccess: (mesa: string) => void }) {
  const [error, setError] = useState('')
  const containerId = 'qr-reader'

  useEffect(() => {
    let scanner: any = null

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        scanner = new Html5Qrcode(containerId)
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 200, height: 200 } },
          (decodedText: string) => {
            let mesa = ''
            try {
              const url = new URL(decodedText)
              const hash = url.hash
              const qIndex = hash.indexOf('?')
              if (qIndex !== -1) {
                const params = new URLSearchParams(hash.slice(qIndex))
                mesa = params.get('mesa') || ''
              }
            } catch {
              if (/^[1-9]$|^10$/.test(decodedText.trim())) {
                mesa = decodedText.trim()
              }
            }

            if (mesa && /^[1-9]$|^10$/.test(mesa)) {
              scanner?.stop().catch(() => {})
              onSuccess(mesa)
            }
          },
          () => {}
        )
      } catch {
        setError('No se pudo acceder a la cámara')
      }
    }

    startScanner()

    return () => {
      scanner?.stop().catch(() => {})
    }
  }, [onSuccess])

  return (
    <div>
      <div id={containerId} className="aspect-square overflow-hidden rounded-xl bg-black" />
      {error && <p className="mt-2 text-center text-sm text-white/60">{error}</p>}
    </div>
  )
}
