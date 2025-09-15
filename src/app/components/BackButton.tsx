'use client'
import React from 'react'

import { useRouter } from "next/navigation";


const BackButton = ({ isCancelText }: { isCancelText: boolean }) => {
  const router = useRouter();

  return (
    // <a  className="red_button" style={{marginRight:"10px"}} onClick={()=>router.back()}>{isCancelText?"Cancel":"Back"}</a>
    <a onClick={() => router.back()} className='back_btn_anchore_tag'>
      {/* {isCancelText?"Cancel":"Back"} */}
      <div className="nw_user_tab_icon">
        <svg width="20" height="20" x="0" y="0" viewBox="0 0 299.021 299.021">
          <g transform="matrix(0.8000000000000004,0,0,0.8000000000000004,29.90210571289053,29.90212097167965)">
            <path d="M292.866 254.432a6.156 6.156 0 0 1-5.5-3.399c-.354-.684-28.541-52.949-146.169-54.727v51.977a6.146 6.146 0 0 1-3.432 5.513 6.157 6.157 0 0 1-6.461-.63L2.417 154.392A6.154 6.154 0 0 1 0 149.516c0-1.919.898-3.72 2.417-4.888l128.893-98.77a6.164 6.164 0 0 1 6.461-.639 6.14 6.14 0 0 1 3.432 5.509v54.776c3.111-.198 7.164-.37 11.947-.37 43.861 0 145.871 13.952 145.871 143.136a6.15 6.15 0 0 1-4.75 5.993 5.552 5.552 0 0 1-1.405.169z" fill="#ffffff" opacity="1" data-original="#000000"></path>
          </g>
        </svg>
      </div>
      <div className="nw_user_tab_name">
        {isCancelText?
        <div className='back_btn_cancel'>Cancel</div>:<div className='back_btn_back'>Back</div>}
      </div>
    </a>
  )
}

export default BackButton