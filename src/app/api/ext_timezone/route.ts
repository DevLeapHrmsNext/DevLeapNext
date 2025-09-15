import { NextRequest, NextResponse } from "next/server";
import { apiStatusInvalidDataCode, apiStatusSuccessCode, clientAddedFailed, clientAddedSuccess, apifailedWithException } from "@/app/pro_utils/stringConstants";
import { funSendApiErrorMessage, funSendApiException } from "@/app/pro_utils/constant";

export async function POST(request: NextRequest) {
    
    try{
    let ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      request.headers.get("x-real-ip") ||         // Nginx
      "";

    if (typeof ip === "string") {
      ip = ip.split(",")[0].trim(); // use first IP if multiple are present
    }if (ip === '::1' || ip === '127.0.0.1') {
  ip = '8.8.8.8'; // fallback IP for testing
} else {
      ip = "8.8.8.8"; // fallback or default for testing
    }
    
const latlong = await fetch(`https://ipinfo.io/${ip}?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`);
const latlongdata = await latlong.json();
console.log(latlongdata);

const [latitude, longitude] = latlongdata.loc?.split(",") ?? [null, null];        
          



    const timestamp = Math.floor(Date.now() / 1000);
    console.log("this is the timestamp=======",timestamp);

//         const timezoneResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${latitude}%2C${longitude}&timestamp=${timestamp}&key=${process.env.NEXT_PUBLIC_TIMEZONE_KEY}`);
// const timezoneData = await timezoneResponse.json();
        const timezoneResponse = await fetch(`https://api.apyhub.com/data/dictionary/timezone`,{
            method: "GET",
            headers:{"Content-Type": "application/json",'apy-token': `${process.env.NEXT_PUBLIC_TIMEZONE_APYHUB_KEY}`}
        });
        const timezoneData = await timezoneResponse.json();
        // const zones=timezoneData.data.map((zone:any)=>{
        //   return zone.value+" "+ zone.utc_time;  
        // })

        return NextResponse.json({ status :1,message: "All TimeZones",data:timezoneData  }, { status: apiStatusSuccessCode });
        

  
    }catch(error){
        console.log(error);
        
        return funSendApiException(error);
        
    }
}
