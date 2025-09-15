"use client"
import Footer from "@/app/components/footer";
import LeapHeader from "@/app/components/header";
import LeftPannel from "@/app/components/leftPannel";
import AttendanceMap from "@/app/components/trackerMap";
import moment from "moment";
import { useEffect, useState } from "react";

const Tracker = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {

  
    

      const handleScroll = () => {
          setScrollPosition(window.scrollY); // Update scroll position
          const element = document.querySelector('.mainbox');
          
    if (window.pageYOffset > 0) {
      element?.classList.add('sticky');
    } else {
      element?.classList.remove('sticky');
    }
        };
      window.addEventListener('scroll', handleScroll);
      return () => {
         
          window.removeEventListener('scroll', handleScroll);
        };
  }, []);

    const formatDateDDMMYYYY = (date: any, isTime = false) => {
            if (!date) return '';
            const parsedDate = moment(date);
    
            if (isTime) return parsedDate.format('HH:mm A');
    
            return parsedDate.format('DD/MM/YYYY');
        };
    return (
      <div className='mainbox'>
        <header>
        <LeapHeader title="Welcome!" />
        </header>
            <LeftPannel menuIndex={1} subMenuIndex={0} showLeftPanel={true} rightBoxUI={
      <div>
        <h1>Attendance Path</h1>
        {/* <AttendanceMap  attendanceID={"43"} date={formatDateDDMMYYYY(new Date())}/> */}
      </div>

    }/>
     <div>
                <Footer />
            </div>
        </div>
    );
  }
  export default Tracker
  