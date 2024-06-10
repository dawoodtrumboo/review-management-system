import { Model } from '@web/domain'
import { AuthorizationManager } from '@web/domain/authorization'
import { ReactNode, createContext, useContext, useState } from 'react'

export type CoreStoreContext = {
  roles: Model.AuthorizationRole[]
  setRoles: (roles: Model.AuthorizationRole[]) => void

  notifications: Model.Notification[]
  setNotifications: (notifications: Model.Notification[]) => void

  isAdmin: boolean
  isDarkMode: boolean
  setIsDarkMode: (isDarkMode: boolean) => void
}

const StoreContext = createContext<CoreStoreContext>(undefined)

export const useCoreStore = (): CoreStoreContext => {
  return useContext(StoreContext)
}

type Props = {
  children: ReactNode
}

export const CoreStoreProvider: React.FC<Props> = ({ children }) => {
  const [roles, setRoles] = useState<Model.AuthorizationRole[]>([])
  const [notifications, setNotifications] = useState<Model.Notification[]>([])
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const isAdmin = roles.some(role => AuthorizationManager.isAdmin(role))

  return (
    <StoreContext.Provider
      value={{
        roles,
        setRoles,
        notifications,
        setNotifications,
        isAdmin,
        isDarkMode,
        setIsDarkMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
