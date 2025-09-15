


import { NextRequest, NextResponse } from "next/server";
import { apiStatusSuccessCode } from "@/app/pro_utils/stringConstants";
import { funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        let responseData;
        const formData = await request.formData();
        const data = {
            customer_UUID: formData.get('customer_UUID') as string,
            newPassword: formData.get('newPassword') as string,
          }
        // here code will come for leap customer 

          const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MjU2NjksImV4cCI6MjAzNzQwMTY2OX0.s_k0uxO8wB5_N2AhMWtXSKE078bc8aN1dveixgFmmGE"; // notice the "!"
          const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTgyNTY2OSwiZXhwIjoyMDM3NDAxNjY5fQ.HqKtV6PhUfbWe8a_Tjp3F3YZSlQZe4M_eqJNtgPk38E" // notice the "!"
  
          const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${data.customer_UUID}`, {
              method: 'PUT',
              headers: {
                  Authorization: `Bearer ${serviceRoleKey}`,
                  apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
                  'Content-Type': 'application/json',
                },
              body: JSON.stringify({ password: "nikhil123" }),
            });
          
            const result = await response.json();
          
    return NextResponse.json({ status :1,message: "Password updated successfully", data:"Api pending"  }, { status: apiStatusSuccessCode });
    }catch(error){
        return funSendApiException(error);
        
    }
}

