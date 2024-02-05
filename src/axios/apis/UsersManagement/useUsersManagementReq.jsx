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

  const validateEmail = async (email) => {
    return await Request.get('identity/sadmin/v1/Users/ValidateEmail', {
      params: {
        email: email,
      },
    })
  }

  return {
    createTenantAdmin,
    validateEmail,
    createProductAdmin,
    createClientAdmin,
  }
}
