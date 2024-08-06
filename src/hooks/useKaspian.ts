import { useContext } from "react"
import { KaspianContext } from "../contexts/Kaspian"

export default function useKaspian () {
  const context = useContext(KaspianContext)

  if (!context) throw new Error("Missing Kaspian context")

  return context
}
