import React from 'react'
import { Wrapper } from './Preloader.styled'
import { ProgressBar } from 'primereact/progressbar'
import { useSelector } from 'react-redux'

export default ({ show }) => {
  let history = useSelector((state) => state.main.history)

  return (
    <>
      {show && (
        <Wrapper>
          {!(
            history[0] &&
            history[1] &&
            history[history.length - 2] !== '/'
          ) ? (
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
