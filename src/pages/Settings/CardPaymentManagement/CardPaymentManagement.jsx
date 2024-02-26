import React, { useState } from 'react'
import moment from 'moment-timezone'
import Datetime from 'react-datetime'
import { AiFillSave, AiFillEdit } from 'react-icons/ai'

import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from '@themesberg/react-bootstrap'
import { Wrapper } from './CardPaymentManagement.styled'
import BreadcrumbComponent from '../../../components/custom/Shared/Breadcrumb/Breadcrumb'
import {
  BsGearFill,
  BsFillBackspaceFill,
  BsFillQuestionCircleFill,
  BsPlusCircleFill,
} from 'react-icons/bs'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import useRequest from '../../../axios/apis/useRequest'
import UpperContent from '../../../components/custom/Shared/UpperContent/UpperContent'
import { FormattedMessage } from 'react-intl'
import DynamicButtons from '../../../components/custom/Shared/DynamicButtons/DynamicButtons'
import PaymentCardsList from '../../../components/custom/PaymentCards/PaymentCardsList'

const CardPaymentManagement = () => {
  const [edit, setEdit] = useState(false)
  const [oldData, setOldData] = useState({})
  const { getHeathCheckSettings, putHeathCheckSettings } = useRequest()

  return (
    <Wrapper>
      <BreadcrumbComponent
        breadcrumbInfo={'CardManagement'}
        icon={BsGearFill}
      />
      <PaymentCardsList />
    </Wrapper>
  )
}

export default CardPaymentManagement
