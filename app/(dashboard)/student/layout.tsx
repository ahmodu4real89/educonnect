import { Navbar } from "@/app/components/Navbar"

const StudentLayout = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <div className='bg-gray-50'>
        <Navbar/>
        <div  className="max-w-7xl mx-auto mt-9">
            {children}
        </div>
            
    </div>
  )
}

export default StudentLayout