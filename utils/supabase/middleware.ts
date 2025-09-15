// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   // Do not run code between createServerClient and
//   // supabase.auth.getUser(). A simple mistake could make it very hard to debug
//   // issues with users being randomly logged out.

//   // IMPORTANT: DO NOT REMOVE auth.getUser()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//   console.log("this is the user ---------------- ",user);
//   const publicRoutes = ['/']; // Add public routes here
//   const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
//   if (isPublicRoute) {
//     return supabaseResponse;
//   }

//   const contextCompanyName = request.cookies.get('company_name')?.value || 'defaultCompany';


//   if (
//     !user &&
//     !request.nextUrl.pathname.startsWith(`/${contextCompanyName}/Login`) 
//     // !request.nextUrl.pathname.startsWith('/auth')
//   ) {
//     // no user, potentially respond by redirecting the user to the login page
//     const url = request.nextUrl.clone()
//     url.pathname = `/${contextCompanyName}/Login`
//     return NextResponse.redirect(url)
//   }


//   return supabaseResponse
// }


// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function updateSession(request: NextRequest) {
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => request.cookies.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value }) => {
//             NextResponse.next().cookies.set(name, value);
//           });
//         },
//       }
//     }
//   );

//   const publicRoutes = ['/']; // Add more public routes if needed
//   const isPublicRoute = publicRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   );

//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     const contextCompanyName =
//       request.cookies.get('company_name')?.value || 'defaultCompany';

//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = `/${contextCompanyName}/Login`;
//     redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);

//     return NextResponse.redirect(redirectUrl);
//   }

//   const { data: { session } } = await supabase.auth.getSession();

//   if (session) {
//     const response = NextResponse.next();
//     const { access_token, expires_in } = session;
//     const expires_at = Date.now() + expires_in * 1000;
//     response.cookies.delete(session);
//     response.cookies.set('supabase-auth-token', access_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'development',
//       sameSite: 'lax',
//       path: '/',
//       expires: new Date(expires_at),
//     });

//     // Add redirection for authenticated users
//     const authorizedUrl = request.nextUrl.clone();
//     // authorizedUrl.pathname = '/dashboard'; // Replace with the authorized page
//     return NextResponse.redirect(authorizedUrl);
//   }

//   return NextResponse.next();
// }



// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   // Do not run code between createServerClient and
//   // supabase.auth.getUser(). A simple mistake could make it very hard to debug
//   // issues with users being randomly logged out.

//   // IMPORTANT: DO NOT REMOVE auth.getUser()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   const contextCompanyName = request.cookies.get('company_name')?.value || 'defaultCompany';

//   if (
//     !user &&
//     !request.nextUrl.pathname.startsWith(`/${contextCompanyName}/login`) 
//   ) {
//     // no user, potentially respond by redirecting the user to the login page
//     const url = request.nextUrl.clone();
//     url.pathname = `/${contextCompanyName}/login`;
//     return NextResponse.redirect(url);
//   }

//   // IMPORTANT: You *must* return the supabaseResponse object as it is.
//   // If you're creating a new response object with NextResponse.next() make sure to:
//   // 1. Pass the request in it, like so:
//   //    const myNewResponse = NextResponse.next({ request })
//   // 2. Copy over the cookies, like so:
//   //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
//   // 3. Change the myNewResponse object to fit your needs, but avoid changing
//   //    the cookies!
//   // 4. Finally:
//   //    return myNewResponse
//   // If this is not done, you may be causing the browser and server to go out
//   // of sync and terminate the user's session prematurely!

//   return supabaseResponse
// }

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";


export async function updateSession(request: NextRequest) {
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // console.log("Cookies:", request.cookies.getAll()); // Log the cookies for debugging
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const contextCompanyName = request.cookies.get('company_name')?.value || 'default';
  
  console.log("supabase middleware ts",request.nextUrl.pathname);

  if(request.nextUrl.pathname.toLowerCase().includes("/clientadmin/addEmployeeForm") 
    || request.nextUrl.pathname.toLowerCase().includes("/clientadmin/addEmployeeForm/addEmployeeBankDetailsForm")){
      console.log("supabase middleware ts",user);
      return NextResponse.next();
  }
  else if (
    !user &&
    !request.nextUrl.pathname.startsWith(`/${contextCompanyName}/login`) 
    
  ) {
    // console.log("Redirecting to login...");
    const url = request.nextUrl.clone();
    if(contextCompanyName){
    url.pathname = `/${contextCompanyName}/login`;
    }else{
      url.pathname='/default/login'
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}