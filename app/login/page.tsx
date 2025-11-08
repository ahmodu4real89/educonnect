import { Suspense } from "react";
import LoginPage from "./LoginPage";

const Page = () =>{
  return (
      <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
      <LoginPage />
    </Suspense> 
  );
}

export default Page