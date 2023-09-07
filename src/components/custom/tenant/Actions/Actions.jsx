import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { statusConst } from '../../../../const'
import { FormattedMessage } from 'react-intl'
import { BsFillTrash3Fill } from 'react-icons/bs'

const useActions = () => {
  const renderActions = (tenantData, actions, chagneStatus, deleteConfirm) => {
    console.log({ chagneStatus })
    // console.log({ actions })
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
      actions?.map((item, index) => {
        let button = {
          type: 'action',
          func: () => chagneStatus(item.status),
          label: item.name,
          icon: <i className={'pi ' + statusConst[item.status].icon}></i>,
          order: 4,
        }
        actionArray = [...actionArray, button]
      })
      return actionArray
    } else {
      return []
    }
  }

  return { renderActions }
}
export default useActions
