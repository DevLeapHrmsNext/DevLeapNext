import React from 'react'
import { staticIconsBaseURL } from '../pro_utils/stringConstants'

const ShowAlertMessage = ({ title, startContent, midContent, endContent, value1, value2, imageURL, successFailure, onOkClicked, onCloseClicked, showCloseButton }: { title: any, startContent: any, midContent: any, endContent: any, value1: any, value2: any, imageURL: any, successFailure: any, onOkClicked: (successFailure: any) => void, onCloseClicked: () => void, showCloseButton: boolean }) => {
  return (
    <div className='alert_mainbox'>
      <div className='alert_innerbox'>
        <div className='alert_whitebox'>
          <div className="row text-center">
            <div className="col-lg-12 mb-4"><img src={
              imageURL && imageURL.length > 0 ?
                imageURL : successFailure == 1 ? staticIconsBaseURL + "/images/success_icon.png"
                  : successFailure == 2 ? staticIconsBaseURL + "/images/error_icon.png" :
                    staticIconsBaseURL + "/images/default_icon.png"
            }
              style={{ maxWidth: "110px" }} className="img-fluid" /></div>
            <div className="col-lg-12">
              <div className='alert_heading'>
                {title}
              </div>
              <div className='alert_content'>{startContent} <span>{value1}</span> {midContent} <span>{value2}</span>{endContent} </div>
              {showCloseButton ? <div className="row" >
                <div className="col-md-6" >
                  <div className='alert_btn' style={{ float: "right", marginRight: "10px" }}><input type="button" value="Ok" className="red_button" onClick={() => onOkClicked(successFailure)} /></div>
                </div>
                <div className="col-md-6" >
                  <div className='alert_btn' style={{ float: "left", marginLeft: "10px" }}><input type="button" value="Close" className="red_button" onClick={onCloseClicked} /></div>
                </div>
              </div> : 
              <div className='alert_btn' ><input type="button" value="Ok" className="red_button" onClick={() => onOkClicked(successFailure)} /></div>
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowAlertMessage