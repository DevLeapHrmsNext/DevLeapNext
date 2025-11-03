import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "../utils/supabase/middleware";
import { useGlobalContext } from "./app/contextProviders/loggedInGlobalContext";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middel waare is getting called ---------------------------------- ----- -- ",pathname);
  const isAdmin = request.cookies.get("isAdmin")?.value;
  console.log("Middel waare is getting called ---------------------------------- ----- -- ",isAdmin);

  // if(isAdmin){
  //   if (request.nextUrl.pathname.startsWith("/user") && isAdmin.toString()=="true") {
  //       console.log("Middel waare is getting called ----",isAdmin);
      
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }else{
      
  //     return NextResponse.redirect(new URL("/user/dashboard", request.url));
      
  //   }
  // }

  const lowerPath = pathname.toLowerCase();
  const allowList = [ 
      "/login",
      "/forgot-password",
      "/reset-password",
      "/reset-pass/verify-token",
      "/clientadmin/addemployeeform",
      "/terms-and-conditions",
      "/privacy-policy",
      "/clientadmin/addemployeeform/addemployeebankdetailsform",
      "/whats-app/add-task",
      "/whats-app/raise-support",
      "/whats-app/upload-documents",
      "/whats-app/apply-leave",
      "/whats-app",
      "/whats-app/leave-details",
      "/whats-app/support-details"
      // "/firebase-messaging-sw.js"
    ];

  // ✅ Allow password reset & confirmation pages to be accessed
 
  if (pathname === "/" || allowList.some(p => lowerPath.includes(p))) {
      console.log("Middleware called ---- ", pathname);
      return NextResponse.next();
  }

  // ✅ Apply session update for all other routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
  ],
};