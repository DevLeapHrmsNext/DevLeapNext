"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { EmpAttendance, LeapCustomerAttendance } from "../models/DashboardModel";
import { BreakTimingsArray, LeapCustomerAttendanceAPI } from "../models/AttendanceDataModel";
import { baseUrl } from "../pro_utils/stringRoutes";
import moment from "moment";
import LoadingDialog from "./PageLoader";
import { ALERTMSG_exceptionString } from "../pro_utils/stringConstants";
import ShowAlertMessage from "./alert";

const greenMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 44],
    iconAnchor: [14, 44],
    popupAnchor: [1, -34],
});

const redMarkerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 44],
    iconAnchor: [14, 44],
    popupAnchor: [1, -34],
});

const blueMarkerIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const AttendanceMap = ({ attendanceID, date, empName, empID, empDesignation, empDepartment }: { attendanceID: any; date: any, empName: any, empID: any, empDesignation: any, empDepartment: any }) => {
    const [locations, setLocations] = useState<[number, number][]>([]);
    const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
    const [stopLocation, setStopLocation] = useState<[number, number] | null>(null);
    const [atendanceData, setAttendanceData] = useState<LeapCustomerAttendanceAPI>();
    const [breakTimeArray, setBreakTime] = useState<BreakTimingsArray[]>([{
        reason: '',
                            pause_time: '',
                            resume_time: ''
    }]);
    const [mapKey, setMapKey] = useState(0); // Used to force remount
    const [inTime, setInTime] = useState<string | null>(null);
    const [outTime, setOutTime] = useState<string | null>(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
            const [alertForSuccess, setAlertForSuccess] = useState(0);
            const [alertTitle, setAlertTitle] = useState('');
            const [alertStartContent, setAlertStartContent] = useState('');
            const [alertMidContent, setAlertMidContent] = useState('');
            const [alertEndContent, setAlertEndContent] = useState('');
            const [alertValue1, setAlertValue1] = useState('');
            const [alertvalue2, setAlertValue2] = useState('');

    useEffect(() => {
        async function fetchData() {
            setIsDataLoaded(false);
            try {
                const formData = new FormData();
                formData.append("attendance_id", attendanceID);
                formData.append("date", date);

                const res = await fetch("/api/clientAdmin/tracker", {
                    method: "POST",
                    body: formData,
                });

                const response = await res.json();
                if(response && response.status==1){
                const data = response.data[0]?.leap_customer_attendance_geolocation;
                const timeData = response.data?.[0];

                const start = data[0]?.start_location?.[0]?.coordinates || null;
                const stop = data[0]?.stop_location?.coordinates || null;
                setAttendanceData(response.data[0]);
                let pauseTime: BreakTimingsArray[] = [];

                if (response.data[0]?.pause_start_time! && response.data[0]?.pause_start_time.length > 0) {
                    for (let i = 0; i < response.data[0]?.pause_start_time!.length; i++) {
                        pauseTime.push({
                            reason: '',
                            pause_time: response.data[0]?.pause_start_time![i],
                            resume_time: ''
                        })
                    }
                }
                if (response.data[0]?.pause_end_time! && response.data[0]?.pause_end_time.length > 0) {
                    for (let i = 0; i < response.data[0]?.pause_end_time!.length; i++) {
                        pauseTime[i].resume_time = response.data[0]?.pause_end_time[i]
                    }
                }
                if (response.data[0]?.paused_reasons! && response.data[0]?.paused_reasons.length > 0) {
                    for (let i = 0; i < response.data[0]?.paused_reasons!.length; i++) {
                        pauseTime[i].reason = response.data[0]?.paused_reasons[i]
                    }
                }
                
                
                setBreakTime(pauseTime)
                setInTime(timeData?.in_time ? new Date(timeData.in_time).toLocaleTimeString() : null);
                setOutTime(timeData?.out_time ? new Date(timeData.out_time).toLocaleTimeString() : null);

                const otherLocations = [];
                if (data[0]?.pause_location) {
                    otherLocations.push(...data[0]?.pause_location.map((loc: any) => [loc.coordinates[1], loc.coordinates[0]])); // Swap lat/lng
                }
                if (data[0]?.resume_location) {
                    otherLocations.push(...data[0]?.resume_location.map((loc: any) => [loc.coordinates[1], loc.coordinates[0]])); // Swap lat/lng
                }

                // 🛑 Fix Swapped Coordinates Here
                if (start) setStartLocation([start[1], start[0]]);
                if (stop) setStopLocation([stop[1], stop[0]]);
                setLocations(otherLocations);

                

                setMapKey((prevKey) => prevKey + 1); // Force re-mount
                setIsDataLoaded(true);
            }else{
                setIsDataLoaded(false);
                setShowAlert(true);
                setAlertTitle("Error")
                setAlertStartContent("Failed to get employee attendance");
                setAlertForSuccess(2)
            }
            } catch (error) {
                setIsDataLoaded(false);
                setShowAlert(true);
                            setAlertTitle("Exception");
                            setAlertStartContent(ALERTMSG_exceptionString);
                            setAlertForSuccess(2);
                console.error("Error fetching user data:", error);
            }
        }

        fetchData();
    }, [attendanceID, date, empName, empID, empDesignation, empDepartment]);
    // Runs whenever props change
    // Ensure the effect runs when the props change

    return (
        <div style={{ height: "500px", width: "100%" }}>
            {isDataLoaded ? atendanceData?.leap_customer_attendance_geolocation && atendanceData.leap_customer_attendance_geolocation.length>0?(
                <div className="col-lg-12">
                    {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                            setShowAlert(false)
                        }} onCloseClicked={function (): void {
                            setShowAlert(false)
                        }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
                    

                    <MapContainer
                        key={mapKey} // This forces React to re-mount the map when data changes
                        center={startLocation!}
                        zoom={14}
                        scrollWheelZoom={true}
                        style={{ height: "400px", width: "100%", borderRadius:"20px" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />

                        <Marker position={startLocation!} icon={greenMarkerIcon}>
                            <Popup>
                                <b>Start</b>
                                <br />
                                In Time: {inTime != null ? inTime : "NA"}
                            </Popup>
                        </Marker>

                        {stopLocation && (
                            <Marker position={stopLocation} icon={redMarkerIcon}>
                                <Popup>
                                    <b>Stop</b>
                                    <br />
                                    Out Time: {outTime != null ? outTime : "--"}
                                </Popup>
                            </Marker>
                        )}

                        {locations.map((position, index) => (
                            <Marker key={index} position={position} icon={blueMarkerIcon} />
                        ))}

                        {(startLocation || locations.length > 0 || stopLocation) && (
                            <Polyline
                                positions={[
                                    ...(startLocation ? [startLocation] : []),
                                    ...locations,
                                    ...(stopLocation ? [stopLocation] : [])
                                ]}
                                color="blue"
                            />
                        )}
                    </MapContainer>
                </div>):<div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                        {<h3 className="text-muted">Attendance was marked manually</h3>}
                    </div>:<div className="d-flex justify-content-center align-items-center" style={{ height: "40px" }}>
                        {<h3 className="text-muted">Loading...</h3>}
                    </div>
            }
        </div>
    );
};

export default AttendanceMap;

function funCalculateTimeDifference(startDate: Date, endDate: Date) {
    
    if (formatDateDDMMYYYY(startDate.toISOString(), false) == formatDateDDMMYYYY(endDate.toISOString(), false)) {
        const milliDiff: number =
            endDate.getTime() - startDate.getTime();

        // Converting time into hh:mm:ss format

        // Total number of seconds in the difference
        const totalSeconds = Math.floor(milliDiff / 1000);

        // Total number of minutes in the difference
        const totalMinutes = Math.floor(totalSeconds / 60);

        // Total number of hours in the difference
        const totalHours = Math.floor(totalMinutes / 60);

        // Getting the number of seconds left in one minute
        const remSeconds = totalSeconds % 60;

        // Getting the number of minutes left in one hour
        const remMinutes = totalMinutes % 60;

        return `${totalHours}.${remMinutes}`;
    } else {

        let milliDiff: number =

        endDate.getTime() - startDate.getTime();

        // Converting time into hh:mm:ss format

        // Total number of seconds in the difference
        const totalSeconds = Math.floor(milliDiff / 1000);

        // Total number of minutes in the difference
        const totalMinutes = Math.floor(totalSeconds / 60);

        // Total number of hours in the difference
        const totalHours = Math.floor(totalMinutes / 60);

        // Getting the number of seconds left in one minute
        const remSeconds = totalSeconds % 60;

        // Getting the number of minutes left in one hour
        const remMinutes = totalMinutes % 60;

        return `${totalHours}.${remMinutes}`;
    }
}
const formatDateDDMMYYYY = (date: any, isTime = false) => {
    if (!date) return '';
    const parsedDate = moment(date);

    if (isTime) return parsedDate.format('HH:mm A');

    return parsedDate.format('DD/MM/YYYY');
};



// <div className="col-lg-12 ">
//                         <div className="row mb-3 attendance-Detail-box" style={{ alignContent: "center", height: "200px" }}>
//                             <div className="col-lg-4">

//                                 <div className="profile-picture-container" >
//                                     <div style={{
//                                         width: "150px",
//                                         height: "150px",
//                                         borderRadius: "50%",
//                                         // backgroundImage: "url(/images/user.png)",
//                                         backgroundColor: "#FFFFFF",
//                                         display: "flex",
//                                         justifyContent: "center",
//                                         alignItems: "center",
//                                         margin: "0 auto",
//                                         position: "relative",
//                                     }}>
//                                         <img
//                                             src={atendanceData?.img_attachment ? baseUrl + "/" + atendanceData.img_attachment : "/images/user.png"} className="img-fluid"
//                                             style={{
//                                                 // backgroundImage: "url(/images/user.png)",
//                                                 width: "140px",
//                                                 height: "140px",
//                                                 borderRadius: "50%",

//                                             }} />
//                                         {/* <p>Drag & Drop or Click to Upload</p> */}
//                                     </div>
//                                 </div>

//                                 <div className="col-lg-12 text-center">
//                                     <div className="font16Black">{empName}</div>
//                                 </div>
//                                 <div className="col-lg-12 text-center">
//                                     <div className="font14Black">{empID}</div>
//                                 </div>

//                             </div>
//                             <div className="col-lg-8">

//                                 <div className="row mb-2">
//                                     <div className="col-lg-6">
//                                         <div className="col-lg-12">
//                                             <label className="font12Light">Start Time:</label>
//                                         </div>
//                                         <div className="font14Black">{new Date(atendanceData?.in_time!).toLocaleString() || ""}</div>

//                                     </div>
//                                     <div className="col-lg-6">
//                                         <div className="col-lg-12">
//                                             <label className="font12Light"> End Time:</label>
//                                         </div>
//                                         <div className="font14Black">{atendanceData?.out_time && atendanceData?.out_time.length>0?new Date(atendanceData?.out_time!).toLocaleString(): "-"}</div>
//                                     </div>
//                                 </div>
//                                 <div className="row mb-2">
//                                     <div className="col-lg-6">
//                                         <div className="col-lg-12">
//                                             <label className="font12Light">Working type:</label>
//                                         </div>
//                                         <div className="font14Black">{atendanceData?.leap_working_type.type || ""}</div>

//                                     </div>
//                                     <div className="col-lg-6">
//                                         <div className="col-lg-12">
//                                             <label className="font12Light">Total Hours:</label>
//                                         </div>
//                                         <div className="font14Black">
//                                             {atendanceData?.out_time! ? funCalculateTimeDifference(new Date(atendanceData?.in_time!), new Date(atendanceData?.out_time!)):"--"}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row mb-2" >

//                                     <div className="col-lg-12 mb-1">
//                                         <label className="font12Light">Breaks:</label>
//                                     </div>
//                                     <div className="col-lg-12" style={{ height: "80px", overflowX: "scroll" }}>
//                                         <div className="row">
//                                         {breakTimeArray.length>0?breakTimeArray.map((breaks, index) => (

//                                             <div className="col-lg-5 border-box" key={index}>
//                                                 <div className="row mr-10">
//                                                 <div className="font12Black col-lg-12 text-center">{breaks?.reason||""}</div>
//                                                 <div className="font12Black col-lg-12 text-center" > {new Date(breaks?.pause_time).toLocaleTimeString("en-US")} to {breaks?.resume_time?new Date(breaks?.resume_time).toLocaleTimeString("en-US"):"--"} </div>
//                                                 </div>
//                                             </div>

//                                         )):<></>
//                                         }
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>