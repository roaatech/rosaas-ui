import React from 'react'

import { BsFillHouseDoorFill } from 'react-icons/bs'
import { Breadcrumb } from '@themesberg/react-bootstrap'
import { Wrapper } from './Breadcrumb.styled'
import { useEffect } from 'react'
import Navbar from '../../../Navbar/Navbar'
import { useIntl, FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { breadcrumbFun } from '../../../../const/breadcrumb'

const BreadcrumbComponent = ({ breadcrumbInfo, param1, parent, data }) => {
  const routeParams = useParams()
  let direction = useSelector((state) => state.main.direction)
  const intl = useIntl()
  const hasInfo = breadcrumbInfo ? 'yes' : null
  let navigation = '#'
  const breadcrumbConst = breadcrumbFun(routeParams, data)
  if (breadcrumbInfo) {
    if (breadcrumbConst[breadcrumbInfo].navigation) {
      navigation = breadcrumbConst[breadcrumbInfo].navigation
      if (param1) {
        navigation = breadcrumbConst[breadcrumbInfo].navigation.replace(
          '{0}',
          param1
        )
      }
    }
  }
  useEffect(() => {
    if (breadcrumbInfo) {
      if (breadcrumbConst[breadcrumbInfo].name || parent) {
        document.title = `RoSaaS - ${intl.formatMessage({
          id: breadcrumbConst[breadcrumbInfo].name,
        })}`
      }
    }
  })
  return (
    <>
      <Wrapper
        direction={direction}
        className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2"
      >
        <div className="d-block mb-xl-0">
          {hasInfo && (
            <Breadcrumb
              className="d-none d-md-inline-block"
              listProps={{
                className: 'breadcrumb-dark breadcrumb-transparent',
              }}
            >
              <Breadcrumb.Item href="/Dashboard">
                <BsFillHouseDoorFill />
              </Breadcrumb.Item>

              {breadcrumbConst[breadcrumbInfo].title && (
                <Breadcrumb.Item
                  // href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].title
                  }
                >
                  {intl.formatMessage({
                    id: breadcrumbConst[breadcrumbInfo].title,
                  })}
                </Breadcrumb.Item>
              )}

              {breadcrumbConst[breadcrumbInfo].parent && (
                <Breadcrumb.Item
                  href={
                    breadcrumbConst[breadcrumbInfo]?.parentNavigation ||
                    navigation
                  }
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].parent
                  }
                >
                  {breadcrumbConst[breadcrumbInfo].changableParent
                    ? breadcrumbConst[breadcrumbInfo].parent
                    : intl.formatMessage({
                        id: breadcrumbConst[breadcrumbInfo].parent,
                      })}{' '}
                </Breadcrumb.Item>
              )}

              {breadcrumbConst[breadcrumbInfo].name && (
                <Breadcrumb.Item
                  href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    intl.formatMessage({
                      id: breadcrumbConst[breadcrumbInfo].name,
                    })
                  }
                >
                  {intl.formatMessage({
                    id: breadcrumbConst[breadcrumbInfo].name,
                  })}
                </Breadcrumb.Item>
              )}

              {breadcrumbConst[breadcrumbInfo].child && (
                <Breadcrumb.Item
                  href={navigation}
                  active={
                    breadcrumbConst[breadcrumbInfo].active ==
                    breadcrumbConst[breadcrumbInfo].child
                  }
                >
                  {breadcrumbConst[breadcrumbInfo].child}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>
          )}
        </div>
        <Navbar />
      </Wrapper>
    </>
  )
}

export default BreadcrumbComponent
