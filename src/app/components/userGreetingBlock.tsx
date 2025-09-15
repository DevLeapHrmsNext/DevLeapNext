
// user dashboard greeting

'use client'
import React, { useEffect, useRef, useState } from 'react'
import ShowAlertMessage from '@/app/components/alert'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LoadingDialog from './PageLoader';

const GreetingBlock = ({greetData}:{greetData:any}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [greetArray, setGreetData] = useState<any>();
    const [isLoading, setLoading] = useState(false);
    const [fact, setFact] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [alertForSuccess, setAlertForSuccess] = useState(0);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertStartContent, setAlertStartContent] = useState('');
    const [alertMidContent, setAlertMidContent] = useState('');
    const [alertEndContent, setAlertEndContent] = useState('');
    const [alertValue1, setAlertValue1] = useState('');
    const [alertvalue2, setAlertValue2] = useState('');
    useEffect(() => {
        // console.log("greetData: ", greetData)
         setGreetData(greetData)
        fetchRandomFact();
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
    const fetchRandomFact = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
            const data = await response.json();
            setFact(data.text);
        } catch (error) {
            console.error("Error fetching fact:", error);
            setFact("Couldn't load fact");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new_personalize_greeting_mainbox">
            <LoadingDialog isLoading={isLoading} />
            {showAlert && <ShowAlertMessage title={alertTitle} startContent={alertStartContent} midContent={alertMidContent && alertMidContent.length > 0 ? alertMidContent : ""} endContent={alertEndContent} value1={alertValue1} value2={alertvalue2} onOkClicked={function (): void {
                setShowAlert(false)
            }} onCloseClicked={function (): void { 
                setShowAlert(false)
            }} showCloseButton={false} imageURL={''} successFailure={alertForSuccess} />}
            <div className="new_personalised_leftbox">
                <h3>{greetArray}</h3>
                <div className='user_greating_box_para'>
                    <p className='m-0'>{fact}</p>
                </div>
            </div>
        </div>
    )
}
export default GreetingBlock