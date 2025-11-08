import { Suspense } from "react";
import RegisterPage from "./RegisterPage";


const Page = () =>{
  return (
      <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
      <RegisterPage/>
    </Suspense> 
  );
}

export default Page