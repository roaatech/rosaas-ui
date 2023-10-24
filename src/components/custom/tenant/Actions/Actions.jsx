import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { statusConst } from '../../../../const'
import { FormattedMessage } from 'react-intl'
import { BsFillTrash3Fill } from 'react-icons/bs'

const useActions = () => {
  const renderActions = (
    tenantData,
    actions,
    chagneStatus,
    statusConfirm,
    deleteConfirm
  ) => {
    let actionArray = []
    if (actions) {
      if (actions && actions[0]?.status == 13 && tenantData) {
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
      actions &&
        actions.map((item) => {
          if (item.status == 11 || item.status == 8) {
            let button = {
              type: 'action',
              func: () => statusConfirm(item.status),
              label: item.name,
              icon: <i className={'pi ' + statusConst[item.status].icon}></i>,
              order: 4,
            }
            actionArray = [...actionArray, button]
          } else {
            let button = {
              type: 'action',
              func: () => chagneStatus(item.status),
              label: item.name,
              icon: <i className={'pi ' + statusConst[item.status].icon}></i>,
              order: 4,
            }
            actionArray = [...actionArray, button]
          }
        })
      return actionArray
    } else {
      return []
    }
  }

  return { renderActions }
}
export default useActions
