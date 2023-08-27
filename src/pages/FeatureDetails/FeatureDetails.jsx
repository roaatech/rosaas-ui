import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FeatureInfo } from '../../store/slices/products';
import useRequest from '../../axios/apis/useRequest';
import { Wrapper } from './FeatureDetails.styled';
import { BsBoxSeam, BsFillTrash3Fill } from 'react-icons/bs';
import BreadcrumbComponent from '../../components/custom/Shared/Breadcrumb/Breadcrumb';
import UpperContent from '../../components/custom/Shared/UpperContent/UpperContent';
import { FormattedMessage } from 'react-intl';
import FeatureDetailsTab from '../../components/custom/Feature/FeatureDetailsTab/FeatureDetailsTab';
import { TabView, TabPanel } from 'primereact/tabview';
import DynamicButtons from '../../components/custom/Shared/DynamicButtons/DynamicButtons';
import { AiFillEdit } from 'react-icons/ai';

const FeatureDetails = (props) => {
  const routeParams = useParams();
  const listData = useSelector((state) => state.products.products);
  let featureData = listData[routeParams.productId].features[routeParams.id];
  console.log(featureData);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const { getFeature, deleteFeatureReq } = useRequest();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const featureData = await getFeature(routeParams.id, routeParams.productId);
        dispatch(
          FeatureInfo({ productId: routeParams.productId, featureId: routeParams.id, data: featureData.data.data })
        );
        console.log(featureData.data.data);

        // Redirect to the product page after fetching feature data on mount
        props.history.push(`/products/${routeParams.productId}`);
      } catch (error) {
        // Handle errors here
        console.error('Error fetching feature data:', error);
      }
    };

    fetchData();
  }, [dispatch, props.history, routeParams.id, routeParams.productId]);

  return (
    <Wrapper>
      {featureData && (
        <BreadcrumbComponent breadcrumbInfo={'FeatureDetails'} param1={featureData.id} icon={BsBoxSeam} />
      )}

      {featureData && (
        <div className="main-container">
          <UpperContent>
            <h4 className="m-0">
              <FormattedMessage id="Feature-Details" /> : {featureData.name}
            </h4>
            {/* <DynamicButtons
              buttons={[
                {
                  order: 2,
                  type: 'form',
                  id: routeParams.id,
                  label: 'Edit-Feature',
                  component: 'editFeature',
                  icon: <AiFillEdit />,
                },

                {
                  order: 1,
                  type: 'delete',
                  confirmationMessage: 'delete-plan-confirmation-message',
                  id: routeParams.id,
                  navAfterDelete: '/plans',
                  label: 'Delete-Plan',
                  request: 'deletePlanReq',
                  icon: <BsFillTrash3Fill />,
                },
              ]}
            /> */}
          </UpperContent>
          <TabView className="card">
            <TabPanel header={<FormattedMessage id="Details" />}>
              <FeatureDetailsTab data={featureData} />
            </TabPanel>
          </TabView>
        </div>
      )}
    </Wrapper>
  );
};

export default FeatureDetails;
