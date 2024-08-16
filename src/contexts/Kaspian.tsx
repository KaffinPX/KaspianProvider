import { type ReactNode, createContext, useCallback, useEffect, useRef, useState } from "react"
import type { ProviderInfo, AccountInfo, Event, Request, RequestMappings, EventMappings } from "./protocol"

export const KaspianContext = createContext<{
  providers: ProviderInfo[]
  connect: (id: string) => Promise<void>,
  account: AccountInfo | undefined,
  invoke: <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => Promise<EventMappings[M]>
  disconnect: () => Promise<void>,
} | undefined>(undefined)

export function KaspianProvider ({ children }: {
  children: ReactNode
}) {
  const [ providers, setProviders ] = useState<ProviderInfo[]>([])
  const [ account, setAccount ] = useState<AccountInfo>()
  
  const messagesRef = useRef(new Map<number, [(response: any) => void, (error: number) => void]>())
  const nonceRef = useRef(0)

  useEffect(() => {
    window.addEventListener('kaspa:provider', (event) => {
      const customEvent = event as CustomEvent
      
      setProviders((providers) => {
        if (providers.includes(customEvent.detail)) return providers

        return [ ...providers, customEvent.detail ]
      })
    })

    window.addEventListener('kaspa:event', (event) => {
      const customEvent = event as CustomEvent
      const kaspianEvent = customEvent.detail as Event

      if (kaspianEvent.event === 'account' && kaspianEvent.data) {
        setAccount(kaspianEvent.data)
      } 

      const request = messagesRef.current.get(kaspianEvent.id)
      if (!request) return

      const [ resolve, reject ] = request

      if (kaspianEvent.error) {
        reject(kaspianEvent.error)
      } else {
        resolve(kaspianEvent.data)
      }

      messagesRef.current.delete(kaspianEvent.id)
    })

    window.addEventListener('kaspa:disconnect', () => {
      setAccount(undefined)
    })

    window.dispatchEvent(new CustomEvent("kaspa:requestProviders"))
  }, [])

  const connect = useCallback((id: string) => {
    return new Promise<void>((resolve, reject) => {
      window.addEventListener('kaspa:disconnect', () => reject(), { once: true })
      window.addEventListener('kaspa:event', () => resolve(), { once: true })

      window.dispatchEvent(new CustomEvent("kaspa:connect", {
        detail: id
      }))
    })
  }, [])


  const invoke = useCallback(<M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
    return new Promise<EventMappings[M]>((resolve, reject) => {
      const request: Request<M> = {
        id: ++nonceRef.current,
        method,
        params
      }

      window.dispatchEvent(new CustomEvent("kaspa:invoke", {
        detail: request
      }))

      messagesRef.current.set(request.id, [ resolve, reject ])
    })
  }, [])

  const disconnect = useCallback(() => {
    return new Promise<void>((resolve) => {
      window.addEventListener('kaspa:disconnect', () => resolve(), { once: true })

      window.dispatchEvent(new CustomEvent("kaspa:disconnect"))
    })
  }, [])

  return (
    <KaspianContext.Provider value={{ providers, connect, account, invoke, disconnect }}>
      {children}
    </KaspianContext.Provider>
  )
}
