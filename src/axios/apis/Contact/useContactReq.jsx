import React from 'react'
import useApi from '../../useApi'

const useContactReq = () => {
  const Request = useApi()
  const getPaginationContactMessagesList = async (query) => {
    return await Request.get(`management/sadmin/v1/ContactForms${query}`)
  }
  const getContactMessageById = async (id) => {
    return await Request.get(`management/sadmin/v1/ContactForms/${id}`)
  }
  const deleteContactMessageById = async (id) => {
    return await Request.delete(`management/sadmin/v1/ContactForms/${id}`)
  }
  const replayContactMessageById = async (id, data) => {
    return await Request.post(
      `management/sadmin/v1/ContactForms/${id}/Replay`,
      data
    )
  }
  return {
    getPaginationContactMessagesList,
    getContactMessageById,
    deleteContactMessageById,
    replayContactMessageById,
  }
}

export default useContactReq
