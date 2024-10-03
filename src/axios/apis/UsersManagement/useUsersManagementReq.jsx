import useApi from '../../useApi'

export default function useUsersManagementReq() {
  const Request = useApi()

  const createTenantAdmin = async (data) => {
    return await Request.post('identity/sadmin/v1/Users/TenantAdmin', data)
  }

  const createProductAdmin = async (data) => {
    return await Request.post('identity/sadmin/v1/Users/ProductAdmin', data)
  }

  const createClientAdmin = async (data) => {
    return await Request.post('identity/sadmin/v1/Users/ClientAdmin', data)
  }
  const clientsLookup = async () => {
    return await Request.get('identity/sadmin/v1/ClientCredential/Lookup')
  }

  const validateEmail = async (email) => {
    return await Request.get('identity/sadmin/v1/Users/ValidateEmail', {
      params: {
        email: email,
      },
    })
  }
  const getUserById = async (userId) => {
    return await Request.get(`identity/sadmin/v1/Users/${userId}`)
  }

  return {
    createTenantAdmin,
    validateEmail,
    createProductAdmin,
    createClientAdmin,
    clientsLookup,
    getUserById,
  }
}
