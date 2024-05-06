import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'

export const webhhookActiveStatus = {
  true: {
    background: 'var(--green2)',
    value: <FormattedMessage id="Active" />,
    color: 'var(--teal-green)',
  },
  false: {
    background: 'var(--red2)',
    value: <FormattedMessage id="Inactive" />,
    color: 'var(--orange-brown)',
  },
}
export const NodeService = {
  getTreeNodesData() {
    return [
      {
        key: 'metadata',
        label: 'Metadata',
        data: 'metadata Folder',
        icon: 'pi pi-fw pi-folder',
        children: [
          {
            key: 1,
            label: 'Updated',
            icon: 'pi pi-fw pi-bolt',
            data: 'Updated Metadata',
          },
        ],
      },
      {
        key: 'status',
        label: 'Status',
        icon: 'pi pi-fw pi-folder',
        data: 'status Folder',
        children: [
          {
            key: 2,
            label: 'Changed',
            icon: 'pi pi-fw pi-bolt',
            data: 'Changed Status',
          },
          {
            key: 3,
            label: 'Healthy',
            icon: 'pi pi-fw pi-bolt',
            data: 'Healthy Status',
          },
          {
            key: 4,
            label: 'Unhealthy',
            icon: 'pi pi-fw pi-bolt',
            data: 'Unhealthy Status',
          },
        ],
      },
      {
        key: 'externalSystem',
        label: 'External System',
        icon: 'pi pi-fw pi-folder',
        data: 'externalSystem Folder',
        children: [
          {
            key: 5,
            label: 'Successfully Informed',
            icon: 'pi pi-fw pi-bolt',
            data: 'Successfully Informed External System',
          },
          {
            key: 6,
            label: 'Failed to Inform',
            icon: 'pi pi-fw pi-bolt',
            data: 'Failed to Inform External System',
          },
        ],
      },
      {
        key: 'subscription',
        label: 'Subscription',
        icon: 'pi pi-fw pi-folder',
        data: 'subscription Folder',
        children: [
          {
            key: 7,
            label: 'Was Set As Unpaid For Non Renewal',
            icon: 'pi pi-fw pi-bolt',
            data: 'Was Set As Unpaid For Non Renewal Subscription',
          },
          {
            key: 8,
            label: 'Specifications Updated',
            icon: 'pi pi-fw pi-bolt',
            data: 'Specifications Updated Subscription',
          },
          {
            key: 'reset',
            label: 'Reset',
            icon: 'pi pi-fw pi-folder',
            data: 'reset Folder',
            children: [
              {
                key: 9,
                label: 'Prepared',
                icon: 'pi pi-fw pi-bolt',
                data: 'Prepared Reset Subscription',
              },
              {
                key: 10,
                label: 'Applied Done',
                icon: 'pi pi-fw pi-bolt',
                data: 'Applied Done Reset Subscription',
              },
              {
                key: 11,
                label: 'Application Failed',
                icon: 'pi pi-fw pi-bolt',
                data: 'Application Failed Reset Subscription',
              },
            ],
          },
          {
            key: 'autoRenewal',
            label: 'Auto Renewal',
            icon: 'pi pi-fw pi-folder',
            data: 'autoRenewal Folder',
            children: [
              {
                key: 13,
                label: 'Enabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Enabled Auto Renewal Subscription',
              },
              {
                key: 14,
                label: 'Canceled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Canceled Auto Renewal Subscription',
              },
            ],
          },
          {
            key: 15,
            label: 'Renewed',
            icon: 'pi pi-fw pi-bolt',
            data: 'Renewed Subscription',
          },
          {
            key: 16,
            label: 'Renewed Failed',
            icon: 'pi pi-fw pi-bolt',
            data: 'Renewed Failed Subscription',
          },
          {
            key: 17,
            label: 'Created',
            icon: 'pi pi-fw pi-bolt',
            data: 'Created Subscription',
          },
          {
            key: 18,
            label: 'Updated',
            icon: 'pi pi-fw pi-bolt',
            data: 'Updated Subscription',
          },
          {
            key: 'upgrade',
            label: 'Upgrade',
            icon: 'pi pi-fw pi-folder',
            data: 'upgrade Folder',
            children: [
              {
                key: 19,
                label: 'Requested',
                icon: 'pi pi-fw pi-bolt',
                data: 'Requested Upgrade Subscription',
              },
              {
                key: 20,
                label: 'Prepared',
                icon: 'pi pi-fw pi-bolt',
                data: 'Prepared Upgrade Subscription',
              },
              {
                key: 21,
                label: 'Being Applied',
                icon: 'pi pi-fw pi-bolt',
                data: 'Being Applied Upgrade Subscription',
              },
              {
                key: 22,
                label: 'Application Failed',
                icon: 'pi pi-fw pi-bolt',
                data: 'Application Failed Upgrade Subscription',
              },
              {
                key: 23,
                label: 'Applied Done',
                icon: 'pi pi-fw pi-bolt',
                data: 'Applied Done Upgrade Subscription',
              },
            ],
          },
          {
            key: 'downgrade',
            label: 'Downgrade',
            icon: 'pi pi-fw pi-folder',
            data: 'downgrade Folder',
            children: [
              {
                key: 24,
                label: 'Requested',
                icon: 'pi pi-fw pi-bolt',
                data: 'Requested Downgrade Subscription',
              },
              {
                key: 25,
                label: 'Prepared',
                icon: 'pi pi-fw pi-bolt',
                data: 'Prepared Downgrade Subscription',
              },
              {
                key: 26,
                label: 'Being Applied',
                icon: 'pi pi-fw pi-bolt',
                data: 'Being Applied Downgrade Subscription',
              },
              {
                key: 27,
                label: 'Application Failed',
                icon: 'pi pi-fw pi-bolt',
                data: 'Application Failed Downgrade Subscription',
              },
              {
                key: 28,
                label: 'Applied Done',
                icon: 'pi pi-fw pi-bolt',
                data: 'Applied Done Downgrade Subscription',
              },
            ],
          },
          {
            key: 'trial',
            label: 'Trial',
            icon: 'pi pi-fw pi-folder',
            data: 'trial Folder',
            children: [
              {
                key: 29,
                label: 'Started',
                icon: 'pi pi-fw pi-bolt',
                data: 'Started Trial Subscription',
              },
              {
                key: 30,
                label: 'Ended',
                icon: 'pi pi-fw pi-bolt',
                data: 'Ended Trial Subscription',
              },
            ],
          },
        ],
      },
    ]
  },
}
