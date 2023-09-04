import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { statusConst } from '../../../../const'
import { FormattedMessage } from 'react-intl'
import { BsFillTrash3Fill } from 'react-icons/bs'

const Actions = ({
  tenantData,
  actions,
  deleteConfirm,
  chagneStatus,
  actionList,
  setActionList,
}) => {
  useEffect(() => {
    let actionArray = []
    if (actions && Actions[0]?.status == 13 && tenantData) {
      actionArray = [
        ...actionArray,
        {
          order: 1,
          type: 'action',
          label: 'Delete',
          func: () => deleteConfirm(tenantData.data.id),
          icon: <BsFillTrash3Fill />,
        },
      ]
    }
    actions?.map((item, index) => {
      let button = {
        type: 'action',
        func: () => chagneStatus(item.status),
        label: item.name,
        icon: `pi ${statusConst[item.status].icon}`,
        order: 4,
      }
      actionArray = [...actionArray, button]
    })
    console.log({ actionArray })
    setActionList([...actionList, ...actionArray])
  }, [])

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
