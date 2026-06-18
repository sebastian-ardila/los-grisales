import { useEffect } from 'react'

interface Props {
  data: Record<string, unknown>
}

/** Inyecta un <script type="application/ld+json"> en <head>. Helmet (v3) no
 * monta scripts inline en React 19, así que lo hacemos vía efecto. Se reinyecta
 * cuando cambian los datos (navegación entre artículos) y se limpia al desmontar. */
export default function JsonLd({ data }: Props) {
  const json = JSON.stringify(data)
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = json
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [json])
  return null
}
