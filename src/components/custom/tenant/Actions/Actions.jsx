import { Button } from 'primereact/button'
import React from 'react'
import { statusConst } from '../../../../const'
import { FormattedMessage } from 'react-intl'

const Actions = ({ tenantData, actions, deleteConfirm, chagneStatus }) => {
  return (
    <>
      {actions && Actions[0]?.status == 13 ? (
        <>
          {tenantData && (
            <Button
              className="mr-3"
              label={<FormattedMessage id="Delete" />}
              icon="pi pi-trash"
              onClick={() => deleteConfirm(tenantData.data.id)}
              style={{
                backgroundColor: 'var(--red)',
                borderColor: 'var(--red)',
              }}
            />
          )}
        </>
      ) : null}
      {actions?.map((item, index) => (
        <Button
          key={index}
          className="mr-3"
          label={<FormattedMessage id={item.name} />}
          icon={`pi ${statusConst[item.status].icon}`}
          style={{
            backgroundColor: statusConst[item.status].color,
            borderColor: statusConst[item.status].color,
          }}
          onClick={() => chagneStatus(item.status)}
        />
      ))}
    </>
  )
}

export default Actions
