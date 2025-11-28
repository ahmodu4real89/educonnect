import { UserProvider } from "../context/UserContext"

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}

export default DashboardLayout