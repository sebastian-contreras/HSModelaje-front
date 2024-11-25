import { createContext, useState, useEffect, useContext } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [actualUser, setActualUser] = useState(null)
  const getTokenFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    try {
      if (storedToken) {
        return storedToken
      }
    } catch {
      logout()
    }
  }

  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  }

  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = getTokenFromStorage()
    const storedUser = getUserFromStorage()
    setToken(storedToken)
    setUser(storedUser)
    setLoading(false)
  }, [])

  const login = userData => {
    setActualUser(userData)
    const storedToken = getTokenFromStorage()
    const storedUser = getUserFromStorage()
    setToken(storedToken)
    setUser(storedUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setActualUser(null)
    setToken(null)
    setUser(null)
    // Optionally, redirect to login page after logout
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        loading,
        actualUser,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
