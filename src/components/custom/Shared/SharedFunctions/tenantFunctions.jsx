const chagneStatus = async (
  data,
  notes,
  editTenantStatus,
  tenantId,
  productData,
  updateTenant
) => {
  await editTenantStatus({
    TenantId: tenantId,
    status: data?.status,
    actionType: data?.actionType,
    comment: notes,
    productId: productData.id,
  })
  updateTenant()
}
