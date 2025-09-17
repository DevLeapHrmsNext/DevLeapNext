import { NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/server';
import { funloggedInAnotherDevice, funSendApiErrorMessage } from '@/app/pro_utils/constant';
import { generate16BitAlphanumericToken } from '@/app/pro_utils/helpers';
import { isAuthTokenValid } from '@/app/pro_utils/constantFunGetData';
// import supabase from '../../supabaseConfig/supabase';

export async function POST(request: Request) {
  try {
    const supabase =await createClient();
    // console.log( await request.json());
    const {semail, spassword, loginType, social_login, platform,fcm_token } = await request.json();
    // const requestEmail = String(formData.get('email'));
    // const reqPassword = String(formData.get('password'));
    // const loginType = String(formData.get('loginType'));
    // const isSocialLogin = String(formData.get('social_login'));

    let email,password="";
    if (loginType == 'email') {
      email=semail;
      password=spassword;
      
    } else if (loginType == "empID") {
      // email based on loginType
      const { data: userData, error: userError } = await supabase
        .from("leap_customer")
        .select("email_id")
        .eq('emp_id',semail)
        .limit(1);


      if (userError || !userData) {
        
        // return NextResponse.json(userError?.message || "Invalid input or user not found.");
        return NextResponse.json({status: 0,error:userError?.message || "Invalid input or user not found."});
      }
      email=userData[0].email_id;
      password=spassword;

    }

    const { data,error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({status:0, error: error.message }, { status: 200 }); 
    }
    // await supabase.auth.setSession(data.session);
    
    // console.log("this is the session in the api------------------    ",await supabase.auth.getSession());
    // return Response.json({"data":data});
    const authID = data.user.id;
    return authUserDetails(authID,platform,fcm_token);

  }
  catch (error) {
    console.log(error);
    
    return NextResponse.json({ status:0,error: "Unexpected error occurred" }, { status: 500 });
  }
}

async function authUserDetails(authUUID: any, platform: any, fcm_token: any) {
  const supabase = await createClient();


  const { data: cust, error: custFetchError } = await supabase
    .from("leap_customer")
    .select("customer_id, auth_token")
    .eq("authUuid", authUUID)
    .neq("employment_status", false);

  if (custFetchError) {
    return funSendApiErrorMessage(custFetchError, "Unable to fetch customer");
  }

  if (!cust || cust.length === 0) {
     const { data: inactiveUser } = await supabase
      .from("leap_customer")
      .select("customer_id")
      .eq("authUuid", authUUID)
      .eq("employment_status", false)
      .single();

    if (inactiveUser) {
      return NextResponse.json(
        { status: 0, message: "Your account is inactive. Please contact support." },
        { status: 200 }
      );
    }

    return NextResponse.json({ status: 0, message: "No customer found" }, { status: 200 });
  }

  const customer = cust[0];


  if (platform === "ios" || platform === "android") {
    if (!customer.auth_token) {
      // if null generate 
      const generateAuthToken = generate16BitAlphanumericToken();
      const newAuthToken = `${customer.customer_id}_${generateAuthToken}`;

      const { error: updateError } = await supabase
        .from("leap_customer")
        .update({ auth_token: newAuthToken })
        .eq("customer_id", customer.customer_id);

      if (updateError) {
        return funSendApiErrorMessage(updateError, "Unable to update token");
      }
    } else {
  
      const isValid = await isAuthTokenValid(platform, customer.customer_id, customer.auth_token);
      if (!isValid) {
        return funloggedInAnotherDevice(); 
      }
    }

   
    const { error: fcmUpdateError } = await supabase
      .from("leap_customer_fcm_tokens")
      .upsert({ customer_id: customer.customer_id, fcm_token }, { onConflict: "customer_id" });

    if (fcmUpdateError) {
      console.error("Supabase error:", fcmUpdateError);
    }
  }


  const { data, error } = await supabase
    .from("leap_customer")
    .select(
      "client_id, customer_id, branch_id, user_role, name, gender, profile_pic, manager_id, designation_id(designation_name), department_id(department_name), auth_token"
    )
    .eq("authUuid", authUUID);

  if (error) {
    return funSendApiErrorMessage(error, "Unable to login");
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ status: 0, message: "No user found" }, { status: 200 });
  }

  return NextResponse.json(
    {
      status: 1,
      message: "Data Fetched Successfully",
      client_data: data[0],
    },
    { status: 200 }
  );
}