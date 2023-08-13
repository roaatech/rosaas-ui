import React from 'react'
import { Wrapper } from './Preloader.styled'
import { ProgressBar } from 'primereact/progressbar'

export default (props) => {
  const { show } = props

  return (
    <>
      {show && (
        <Wrapper>
          {true ? (
            <div className="loaderCont">
              <div className="loader">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <ProgressBar
              mode="indeterminate"
              style={{ height: '6px' }}
            ></ProgressBar>
          )}
        </Wrapper>
      )}
    </>
  )
}
