import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Loader = () => {
  const isLoading = useSelector((state) => state.main?.isLoading)
  let loaded = useSelector((state) => state.main.preloader)

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isLoading])

  if (!isLoading || loaded) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000,
      }}
    >
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        style={{ color: 'orange', fontSize: '5rem' }}
      />
    </div>
  )
}

export default Loader
