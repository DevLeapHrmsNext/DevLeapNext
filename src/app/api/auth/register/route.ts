import { NextRequest, NextResponse } from "next/server";
import supabase from "../../supabaseConfig/supabase";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
        let responseData;
        const formData = await request.formData();
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
          }
        
          const { data:signUpData,error } = await supabase.auth.signUp(data)
          
          if(error){
            return funSendApiErrorMessage(error , "Sign up error");
          }
          const {data: getCustomerData,error:getCustError}= await supabase.from('leap_customer').select('*').eq("email_id",signUpData.user?.email)
          if(getCustError){
            return funSendApiErrorMessage(error , "Customer fetch Error");
          }
          if(getCustomerData.length>0){
          const {data: customerData,error:custError}= await supabase.from('leap_customer').
                          update ({authUuid:signUpData.user?.id}).eq("email_id",signUpData.user?.email).select();
          if(custError){
            return funSendApiErrorMessage(error , "Customer authID update error");
          } 
          
          
          responseData={authUID:customerData[0].authUuid,
            email:customerData[0].email_id || null,
            customer_id:customerData[0].customer_id || null,
            phone:customerData[0].contact_number || null,
            client_id:customerData[0].client_id
          }             
          
                       
          return NextResponse.json({ status :1,message: clientAddedSuccess, data:responseData }, { status: apiStatusSuccessCode });                 
          }
          responseData={authUID:signUpData.user?.id,
            email:signUpData.user?.email || null,
            customer_id:null,
            phone:signUpData.user?.phone || null,
            client_id: null} 
          return NextResponse.json({ status :1,message: clientAddedSuccess, data:responseData  }, { status: apiStatusSuccessCode });
        

  
    }catch(error){
        return funSendApiException(error);
        
    }
}



/// response on sigup is in data object

//       "user": {
//           "id": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df",
//           "aud": "authenticated",
//           "role": "authenticated",
//           "email": "demouser2@gmail.com",
//           "email_confirmed_at": "2024-12-10T11:49:16.242484922Z",
//           "phone": "",
//           "last_sign_in_at": "2024-12-10T11:49:16.246338052Z",
//           "app_metadata": {
//               "provider": "email",
//               "providers": [
//                   "email"
//               ]
//           },
//           "user_metadata": {
//               "email": "demouser2@gmail.com",
//               "email_verified": false,
//               "phone_verified": false,
//               "sub": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df"
//           },
//           "identities": [
//               {
//                   "identity_id": "64110e0d-4c24-4c8f-99a7-5b3fdf22963b",
//                   "id": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df",
//                   "user_id": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df",
//                   "identity_data": {
//                       "email": "demouser2@gmail.com",
//                       "email_verified": false,
//                       "phone_verified": false,
//                       "sub": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df"
//                   },
//                   "provider": "email",
//                   "last_sign_in_at": "2024-12-10T11:49:16.234489594Z",
//                   "created_at": "2024-12-10T11:49:16.234539Z",
//                   "updated_at": "2024-12-10T11:49:16.234539Z",
//                   "email": "demouser2@gmail.com"
//               }
//           ],
//           "created_at": "2024-12-10T11:49:16.227368Z",
//           "updated_at": "2024-12-10T11:49:16.260384Z",
//           "is_anonymous": false
//       },
//       "session": {
//           "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IlRWNFYyZU0rYUVmcXdGbDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2JiaWFtb3R2bXhrb25kd25xZ2tvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3YzQ2ZGM1ZS1jNzFlLTRjZjYtYmUwMi1lODA3OGNjOGY3ZGYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMzODM0OTU2LCJpYXQiOjE3MzM4MzEzNTYsImVtYWlsIjoiZGVtb3VzZXIyQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJkZW1vdXNlcjJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjdjNDZkYzVlLWM3MWUtNGNmNi1iZTAyLWU4MDc4Y2M4ZjdkZiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzMzODMxMzU2fV0sInNlc3Npb25faWQiOiI5NWQ4MTg5NC01NTJkLTQ1MjgtOGZkNC01ZjEzZmIxMDAyNTUiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.B3YE3qT59gHWtTgolWnRY26dWImsrZhkkiEimipZi8M",
//           "token_type": "bearer",
//           "expires_in": 3600,
//           "expires_at": 1733834956,
//           "refresh_token": "IXqJTGhr1txyFA9PGKj6YQ",
//           "user": {
//               "id": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df",
//               "aud": "authenticated",
//               "role": "authenticated",
//               "email": "demouser2@gmail.com",
//               "email_confirmed_at": "2024-12-10T11:49:16.242484922Z",
//               "phone": "",
//               "last_sign_in_at": "2024-12-10T11:49:16.246338052Z",
//               "app_metadata": {
//                   "provider": "email",
//                   "providers": [
//                       "email"
//                   ]
//               },
//               "user_metadata": {
//                   "email": "demouser2@gmail.com",
//                   "email_verified": false,
//                   "phone_verified": false,
//                   "sub": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df"
//               },
//               "identities": [
//                   {
//                       "identity_id": "64110e0d-4c24-4c8f-99a7-5b3fdf22963b",
//                       "id": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df",
//                       "user_id": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df",
//                       "identity_data": {
//                           "email": "demouser2@gmail.com",
//                           "email_verified": false,
//                           "phone_verified": false,
//                           "sub": "7c46dc5e-c71e-4cf6-be02-e8078cc8f7df"
//                       },
//                       "provider": "email",
//                       "last_sign_in_at": "2024-12-10T11:49:16.234489594Z",
//                       "created_at": "2024-12-10T11:49:16.234539Z",
//                       "updated_at": "2024-12-10T11:49:16.234539Z",
//                       "email": "demouser2@gmail.com"
//                   }
//               ],
//               "created_at": "2024-12-10T11:49:16.227368Z",
//               "updated_at": "2024-12-10T11:49:16.260384Z",
//               "is_anonymous": false
//           }
//       }
