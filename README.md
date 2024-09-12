# KaspianProvider
KaspianProvider makes it easy to connect the Kaspian wallet to your React app. It provides React hooks that let you manage wallet connections, access account info, and send transactions directly from your app.

## Installation

```bash
bun install KaffinPX/KaspianProvider
```

Alternatively, you can install it using any package manager with Git support(for now).

## Usage

1. Wrap your application with the `KaspianProvider`.

```tsx
import { KaspianProvider } from 'KaspianProvider'

function App ({ children }) {
  return <KaspianProvider>{children}</KaspianProvider>
}
```

2. Connect to a wallet.

```tsx
import { useKaspian } from 'KaspianProvider'

function Connection () {
  const { providers, connect } = useKaspian()

  return (
    <div>
      {providers.map((provider) => (
        <button key={provider.id} onClick={() => connect(provider.id)}>
          {provider.name}
        </button>
      ))}
    </div>
  )
}
```

3. Once connected, you should be able to invoke actions and have access to connected account info.

```tsx
import { useKaspian } from 'KaspianProvider'

function MainPage () {
  const { account, invoke } = useKaspian()

  return (
    <div>
      <p>Address: {account.address[0]}</p>
      <button onClick={() => {
        invoke('transact', [[ "kaspa:qz8xga8pme5vwhevpgp3d83ecrr7gh8rmn7hf54clmthp7ewwuufzsrzqhpq0", "10" ]])
      }}>Buy me a coffee!</button>
    </div>
  )
}
```
