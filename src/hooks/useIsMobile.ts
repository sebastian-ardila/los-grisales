import { useState, useEffect } from 'react'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    /Android|iPhone|iPad|iPod|HarmonyOS|Huawei|HUAWEI/i.test(navigator.userAgent)
  )

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|HarmonyOS|Huawei|HUAWEI/i.test(navigator.userAgent))
  }, [])

  return isMobile
}
