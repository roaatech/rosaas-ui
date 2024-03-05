import React, { useState, useEffect } from 'react'
import { Card, Button, Row, Col } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Routes } from '../../../../routes.js' // Make sure you import your routes
import useRequest from '../../../../axios/apis/useRequest.js' // Import your API request hook

export default function SubscriptionList() {
  const { getSubscriptionsList, deleteSubscriptionReq } = useRequest() // Use your API request hook
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    // Fetch subscription data when component mounts
    const fetchData = async () => {
      try {
        const response = await getSubscriptionsList() // You need to implement this function in your API request hook
        setSubscriptions(response.data.data) // Assuming response.data contains the array of subscriptions
      } catch (error) {
        console.error('Error fetching subscription data:', error)
      }
    }
    fetchData()
  }, []) // Empty dependency array ensures the effect runs only once on mount

  const deleteSubscription = async (id) => {
    try {
      await deleteSubscriptionReq({ id }) // Assuming deleteSubscriptionReq is a function to delete subscriptions
      // Update state after successful deletion
      setSubscriptions(
        subscriptions.filter((subscription) => subscription.id !== id)
      )
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  return (
    <div>
      <h4>Subscription List</h4>
      <Row>
        {subscriptions &&
          subscriptions?.map((subscription) => (
            <Col key={subscription.id} md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{subscription.displayName}</Card.Title>
                  <Card.Text>Plan: {subscription.plan.displayName}</Card.Text>
                  <Card.Text>
                    Start Date:{' '}
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </Card.Text>
                  <Card.Text>
                    End Date:{' '}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      onClick={() => deleteSubscription(subscription.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  )
}
