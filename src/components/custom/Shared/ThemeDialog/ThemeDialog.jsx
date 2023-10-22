import React, { useState } from 'react'
import { Wrapper } from './ThemeDialog.styled'
import {
  Button,
  ButtonGroup,
  InputGroup,
  Col,
  Row,
  Form,
  Card,
  Breadcrumb,
  Dropdown,
} from '@themesberg/react-bootstrap'
import { InputText } from 'primereact/inputtext'
import { BsSearch } from 'react-icons/bs'
import { Dialog } from 'primereact/dialog'
import useGlobal from '../../../../lib/hocks/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '@themesberg/react-bootstrap'

const ThemeDialog = ({
  active = true,
  label,
  name,
  icon,
  setSearchValue,
  children,
  visible,
  setVisible,
  size,
  search = true,
}) => {
  return (
    <Wrapper>
      <React.Fragment>
        <Modal
          as={Modal.Dialog}
          centered
          show={visible}
          onHide={() => setVisible(false)}
          size={size}
        >
          {children.length > 1 ? children[0] : children}
        </Modal>
      </React.Fragment>
    </Wrapper>
  )
}

export default ThemeDialog
