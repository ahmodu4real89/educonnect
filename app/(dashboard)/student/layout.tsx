import { Navbar } from "@/app/components/Navbar"

const DashboardLayout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <div className='bg-gray-50'>
        <Navbar/>
        <div className="m-4 p-4">
            {children}
        </div>
            
    </div>
  )
}

export default DashboardLayout