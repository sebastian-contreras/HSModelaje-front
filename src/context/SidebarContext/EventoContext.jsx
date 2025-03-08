import { createContext, useContext, useState } from 'react'

const EventoContext = createContext()

export const EventoProvider = ({ children }) => {
  const [evento, setEvento] = useState(null)

  return (
    <EventoContext.Provider value={{ evento, setEvento }}>
      {children}
    </EventoContext.Provider>
  )
}

export const useEvento = () => {
  return useContext(EventoContext)
}
