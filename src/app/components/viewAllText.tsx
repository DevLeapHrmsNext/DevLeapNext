'use client'
import React from 'react'
import { useRouter } from 'next/navigation';

const ViewAllText = ({goToURL}:{goToURL:any}) => {

    const router = useRouter();

    const goToPage = () => {
        
        router.push(goToURL);
        
      };  
  return (
        <div className='heading25_view_btn mt-2' onClick={goToPage}>View All..</div> 
  )
}

export default ViewAllText