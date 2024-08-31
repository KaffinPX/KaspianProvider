export interface ProviderInfo {
  id: string
  name: string
}

export interface AccountInfo {
  balance: number
  addresses: string[]
  networkId: string
}

export interface CustomInput {
  address: string
  outpoint: string
  index: number,
  signer: string
  script?: string
}

export interface RequestMappings {
  'account': []
  'transact': [[ string, string ][], string?, CustomInput[]?]
}

export interface Request<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface EventMappings {
  'account': AccountInfo,
  'transact': string
}

export interface EventMessage<M extends keyof EventMappings = keyof EventMappings> {
  id: number
  event: M
  data: EventMappings[M] | false
  error?: number
}

export type Event<M extends keyof EventMappings = keyof EventMappings> = {
  [ K in M]: EventMessage<K>
}[ M ]