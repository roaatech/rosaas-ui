import React, { useState, useEffect } from 'react'
import { Card, Row, Col } from '@themesberg/react-bootstrap'

import useRequest from '../../../../axios/apis/useRequest.js'
import { Wrapper } from './InvoicesList.styled'
import UpperContent from '../../Shared/UpperContent/UpperContent.jsx'
import { formatDate } from '../../../../lib/sharedFun/Time.js'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { setAllInvoices } from '../../../../store/slices/workSpace.js'
import SafeFormatMessage from '../../Shared/SafeFormatMessage/SafeFormatMessage.jsx'

// const styles = StyleSheet.create({
//   invoiceContainer: {
//     width: '100%',
//     maxWidth: 600,
//     margin: '0 auto',
//     padding: 20,
//     border: '1px solid #ccc',
//     borderRadius: 5,
//     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
//   },
//   invoiceHeader: {
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   invoiceHeaderText: {
//     fontSize: '2rem',
//     marginBottom: 5,
//   },
//   invoiceHeaderSubText: {
//     fontSize: '1.2rem',
//     color: '#666',
//   },
//   invoiceInfo: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   invoiceDates: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   invoiceItems: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(4, 1fr)',
//     gridGap: 10,
//     marginBottom: 20,
//   },
//   invoiceItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   invoiceTotal: {
//     textAlign: 'center',
//     borderTop: '1px solid #ccc',
//     padding: '20px 0',
//     marginTop: 20,
//   },
// })

export default function InvoicesList() {
  const { getInvoicesList } = useRequest()
  const invoices = useSelector((state) => state.workspace.invoices)
  const dispatch = useDispatch()
  useEffect(() => {
    if (Object.values(invoices).length > 0) {
      return
    }
    const fetchInvoices = async () => {
      try {
        const response = await getInvoicesList()
        dispatch(setAllInvoices(response.data.data))
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }
    fetchInvoices()
  }, [])

  // const generatePdf = (invoice, extractedData) => (
  //   <Document>
  //     <Page size="A4">
  //       <View style={styles.invoiceContainer}>
  //         <View style={styles.invoiceHeader}>
  //           <Text style={styles.invoiceHeaderText}>Invoice</Text>
  //           <Text style={styles.invoiceHeaderSubText}>
  //             #{invoice.orderNumber}
  //           </Text>
  //         </View>
  //         <View style={styles.invoiceInfo}>
  //           <View>
  //             <Text>Bill to:</Text>
  //             <Text>{invoice.billingAddress}</Text>
  //             <Text>
  //               {invoice.billingCity}, {invoice.billingState}{' '}
  //               {invoice.billingZip}
  //             </Text>
  //           </View>
  //           <View>
  //             <Text>Slack</Text>
  //             <Text>500 Howard Street</Text>
  //             <Text>San Francisco, CA 94105</Text>
  //           </View>
  //         </View>
  //         <View style={styles.invoiceDates}>
  //           <View>
  //             <Text>Date:</Text>
  //             <Text>{new Date(invoice.paidDate).toLocaleDateString()}</Text>
  //           </View>
  //           <View>
  //             <Text>Due Date:</Text>
  //             <Text>{new Date(invoice.paidDate).toLocaleDateString()}</Text>
  //           </View>
  //         </View>
  //         <View style={styles.invoiceItems}>
  //           <View style={styles.invoiceItem}>
  //             <Text>Item</Text>
  //             <Text>{invoice.orderItems[0].displayName}</Text>
  //           </View>
  //           <View style={styles.invoiceItem}>
  //             <Text>Quantity</Text>
  //             <Text>{invoice.orderItems[0].quantity}</Text>
  //           </View>
  //           <View style={styles.invoiceItem}>
  //             <Text>Rate</Text>
  //             <Text>${invoice.orderItems[0].unitPriceInclTax.toFixed(2)}</Text>
  //           </View>
  //           <View style={styles.invoiceItem}>
  //             <Text>Amount</Text>
  //             <Text>${invoice.orderTotal.toFixed(2)}</Text>
  //           </View>
  //         </View>
  //         <View style={styles.invoiceTotal}>
  //           <Text>Total:</Text>
  //           <Text>${invoice.orderTotal.toFixed(2)}</Text>
  //         </View>
  //       </View>
  //     </Page>
  //   </Document>
  // )

  // const handleDownloadPDF = async (invoice) => {
  //   const sections = invoice?.orderItems[0].displayName.split(', ')

  //   const extractedData = {}

  //   sections.forEach((section) => {
  //     const matches = section.match(/\[(.*?)\]/)
  //     if (matches && matches.length > 1) {
  //       const [key, value] = matches[1].split(':').map((item) => item.trim())
  //       extractedData[key] = value
  //     }
  //   })

  //   const doc = generatePdf(invoice, extractedData)
  //   const blob = await ReactPDF.pdf(doc).toBlob()
  //   console.log({ blob })
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = `${invoice.orderNumber}.pdf`
  //   document.body.appendChild(a)
  //   a.click()
  //   document.body.removeChild(a)
  // }

  return (
    <Wrapper>
      <UpperContent>
        <h4>
          <SafeFormatMessage id="Invoices-List" />
        </h4>
      </UpperContent>

      <div>
        <Row className="mx-2">
          {Object.values(invoices).map((invoice) => {
            const sections = invoice.orderItems[0].displayName?.split(', ')

            const extractedData = {}

            sections?.forEach((section) => {
              const matches = section.match(/\[(.*?)\]/)
              if (matches && matches.length > 1) {
                const [key, value] = matches[1]
                  .split(':')
                  .map((item) => item.trim())
                extractedData[key] = value
              }
            })

            return (
              <Col key={invoice.id} md={4}>
                <Card className="mb-4">
                  <Card.Header
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    className="pb-0"
                  >
                    <div style={{ flex: 1 }}>
                      <Card.Title>
                        <SafeFormatMessage id="Invoice" />
                      </Card.Title>
                    </div>

                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <strong>
                        <div>
                          <Card.Title
                            style={{
                              color: 'var(--second-color)',
                            }}
                          >
                            {' '}
                            # {invoice.orderNumber}
                          </Card.Title>
                        </div>
                      </strong>
                    </div>
                  </Card.Header>

                  <Card.Body>
                    {' '}
                    <Card.Text>
                      <strong>
                        <SafeFormatMessage id="Product" />:
                      </strong>{' '}
                      {extractedData.Product}
                    </Card.Text>
                    <Card.Text>
                      <strong>
                        <SafeFormatMessage id="Tenant" />:
                      </strong>{' '}
                      {extractedData.Tenant}
                    </Card.Text>
                    <Card.Text>
                      <strong>
                        <SafeFormatMessage id="Plan" />:
                      </strong>{' '}
                      {extractedData.Plan}
                    </Card.Text>
                    <Card.Text>
                      <strong>
                        <SafeFormatMessage id="Invoice-Date" />:
                      </strong>{' '}
                      {formatDate(invoice.paidDate)}
                    </Card.Text>
                    <Card.Footer
                      className="d-flex justify-content-between "
                      style={{ backgroundColor: 'var(--primary1)' }}
                    >
                      <strong>
                        <SafeFormatMessage id="Total" />
                      </strong>{' '}
                      <span style={{ color: 'var(--second-color' }}>
                        <strong> {invoice.orderTotal} $</strong>
                      </span>
                    </Card.Footer>
                    <div className="d-flex justify-content-end">
                      {/* <Dropdown as={ButtonGroup}>
                          <Dropdown.Toggle
                            as={Button}
                            split
                            variant="link"
                            className="text-dark m-0 p-0"
                          >
                            <span className="icon icon-sm">
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                className="icon-dark"
                              />
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleDownloadPDF(invoice)}
                            >
                              <FontAwesomeIcon
                                icon={faFilePdf}
                                className="me-2"
                              />
                              Download as PDF
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown> */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
    </Wrapper>
  )
}
