import React, { useEffect } from 'react'
import { Wrapper } from './Preloader.styled'
import { ProgressBar } from 'primereact/progressbar'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { is } from 'date-fns/locale'

export default ({ show }) => {
  let history = useSelector((state) => state.main.history)
  const isLoading = useSelector((state) => state.main?.isLoading)
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isLoading])

  return (
    <>
      {(show || isLoading) && (
        <Wrapper>
          {!(history[0] && history[1] && history[history.length - 2] !== '/') ||
          isLoading ? (
            <div
              style={{
                transition: 'opacity 0.3s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'rgb(255, 255, 255)',
                zIndex: 1001,
              }}
            >
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                style={{ color: 'orange', fontSize: '5rem' }}
              />
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
