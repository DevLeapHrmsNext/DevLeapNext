import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "../utils/supabase/middleware";
import { useGlobalContext } from "./app/contextProviders/loggedInGlobalContext";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middel waare is getting called ---------------------------------- ----- -- ",pathname);

  // ✅ Allow password reset & confirmation pages to be accessed
  if (pathname === "/" || pathname.toLowerCase().includes("login")
    || pathname.toLowerCase().includes("/forgot-password")
    || pathname.toLowerCase().includes("/reset-password")
    || pathname.toLowerCase().includes("/reset-pass/verify-token")
    || pathname.toLowerCase().includes("/clientadmin/addEmployeeForm")
    || pathname.toLowerCase().includes("/terms-and-conditions")
    || pathname.toLowerCase().includes("/privacy-policy") 
    || pathname.toLowerCase().includes("/clientadmin/addEmployeeForm/addEmployeeBankDetailsForm")) {
      console.log("Middel waare is getting called ---------123------------------------- ----- -- ",pathname);

    return NextResponse.next(); // Let the request pass
  }
  // if(pathname.toLowerCase().includes( addUserDocumentsForm) || pathname.toLowerCase().includes(addUserEmploymentForm)|| 
  // pathname.toLowerCase().includes(addUserAddressBankForm)){

  //   return NextResponse.redirect(userList)
  // }

  // ✅ Apply session update for all other routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
  ],
};