// import { type EmailOtpType } from "@supabase/supabase-js";
// import { type NextRequest, NextResponse } from "next/server";

// // import { createClient } from "../../../../utils/supabase/client";
// import { createClient } from "../../../../utils/supabase/server";
// import { redirect } from "next/navigation";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const token_hash = searchParams.get("token_hash");
//   const type = searchParams.get("type") as EmailOtpType | null;
//   const next = searchParams.get("next") ?? "/";

//   if (token_hash && type) {
//     const supabase = await createClient();

//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     });
//     if (!error) {
//       // redirect user to specified redirect URL or root of app
//       redirect(next);
//     }
//   }

//   // redirect the user to an error page with some instructions
//   redirect("/error");
// }
import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";
import { redirect } from "next/navigation";
import { createClient } from "../../../../utils/supabase/server";
// import supabase from "@/app/api/supabaseConfig/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient(); // This will use the server-side client

    const {data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
  
    
    if (!error) {
      // return redirect(next+"?code="+token_hash);
      return redirect(next);
    }
  }

  return redirect("/error");
}
