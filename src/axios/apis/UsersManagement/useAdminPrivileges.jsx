import useApi from '../../useApi'

export default function useAdminPrivileges() {
  const Request = useApi()

  const tenantAdminPrivileges = async (data, tenantId) => {
    return await Request.post(
      `management/sadmin/v1/Tenant/${tenantId}/AdminPrivileges`,
      data
    )
  }
  const productAdminPrivileges = async (data, productId) => {
    return await Request.post(
      `management/sadmin/v1/Product/${productId}/AdminPrivileges`,
      data
    )
  }
  const clientAdminPrivileges = async (data, clietId) => {
    return await Request.post(
      `management/sadmin/v1/Client/${clietId}/AdminPrivileges`,
      data
    )
  }
  const EntityAdminPrivileges = async (entityId) => {
    return await Request.get(
      `management/sadmin/v1/Entity/${entityId}/AdminPrivileges`
    )
  }
  const deleteAdminPrivileges = async (data) => {
    return await Request.delete(
      `management/sadmin/v1/AdminPrivileges/${data.id}`
    )
  }
  return {
    tenantAdminPrivileges,
    productAdminPrivileges,
    clientAdminPrivileges,
    EntityAdminPrivileges,
    deleteAdminPrivileges,
  }
}
