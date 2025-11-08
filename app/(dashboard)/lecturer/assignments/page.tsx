import ExtensionTable from "@/app/components/ExtensionTable";


const AssignmentGradingPage = async()=> {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gray-50 font-display">
      <div className="flex h-full grow flex-col">
        
        {/* Main Content */}
        <main className="flex flex-1 flex-col p-4 md:flex-row md:gap-6 md:p-6 lg:p-8">
          {/* Left Section */}
          <div className="flex-1">
          
            {/* Title */}
               
          <ExtensionTable />
           
          </div>
        </main>
      </div>
    </div>
  );
}
export default AssignmentGradingPage