import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FormattedMessage } from 'react-intl'
import SafeFormatMessage from '../components/custom/Shared/SafeFormatMessage/SafeFormatMessage'

export const webhhookActiveStatus = {
  true: {
    background: 'var(--green2)',
    value: <SafeFormatMessage id="Active" />,
    color: 'var(--teal-green)',
  },
  false: {
    background: 'var(--red2)',
    value: <SafeFormatMessage id="Inactive" />,
    color: 'var(--orange-brown)',
  },
}
export const NodeService = {
  getTreeNodesData() {
    return [
      {
        key: 'select_all',
        label: 'Select All',
        icon: 'pi pi-fw pi-check-circle',
      },
      {
        key: 'tenant',
        label: 'Tenant',
        icon: 'pi pi-fw pi-folder',
        data: 'tenant Folder',
        children: [
          {
            key: 1,
            label: 'Registered In RoSaas Db',
            icon: 'pi pi-fw pi-bolt',
            data: 'Tenant Registered In RoSaas Db',
          },
          {
            key: 2,
            label: 'Status Changed',
            icon: 'pi pi-fw pi-bolt',
            data: 'Tenant Status Changed',
          },
          {
            key: 'availability',
            label: 'Availability',
            icon: 'pi pi-fw pi-folder',
            data: 'availability Folder',
            children: [
              {
                key: 3,
                label: 'Changed To Healthy',
                icon: 'pi pi-fw pi-bolt',
                data: 'Tenant Availability Changed To Healthy',
              },
              {
                key: 4,
                label: 'Changed To Unhealthy',
                icon: 'pi pi-fw pi-bolt',
                data: 'Tenant Availability Changed To Unhealthy',
              },
            ],
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
            key: 'trial',
            label: 'Trial',
            icon: 'pi pi-fw pi-folder',
            data: 'trial Folder',
            children: [
              {
                key: 5,
                label: 'Upgraded To Standard',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Trial Upgraded To Standard',
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
                key: 6,
                label: 'Disabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Auto Renewal Disabled',
              },
              {
                key: 7,
                label: 'Has Been Renewed Automatically',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Auto Renewal Has Been Renewed Automatically',
              },
              {
                key: 14,
                label: 'Enabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Auto Renewal Enabled',
              },
              {
                key: 15,
                label: 'Auto Renewal Disabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Auto Renewal Disabled',
              },
            ],
          },
          {
            key: 'upgrade',
            label: 'Upgrade',
            icon: 'pi pi-fw pi-folder',
            data: 'upgrade Folder',
            children: [
              {
                key: 8,
                label: 'Has Been Upgraded',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Has Been Upgraded',
              },
              {
                key: 9,
                label: 'Upgrade Enabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Upgrade Enabled',
              },
              {
                key: 16,
                label: 'Upgrading Disabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Upgrading Disabled',
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
                key: 10,
                label: 'Downgrade Enabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Downgrade Enabled',
              },
              {
                key: 11,
                label: 'Forced Downgrade Enabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Forced Downgrade Enabled',
              },
              {
                key: 12,
                label: 'Has Been Downgraded',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Has Been Downgraded',
              },
              {
                key: 17,
                label: 'Downgrading Disabled',
                icon: 'pi pi-fw pi-bolt',
                data: 'Subscription Downgrading Disabled',
              },
            ],
          },
          {
            key: 13,
            label: 'Suspended Due To Unpaid',
            icon: 'pi pi-fw pi-bolt',
            data: 'Subscription Suspended Due To Unpaid',
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
            key: 18,
            label: 'Is Being Provisioned Tenant Resources',
            icon: 'pi pi-fw pi-bolt',
            data: 'External System Is Being Provisioned Tenant Resources',
          },
          {
            key: 19,
            label: 'Created Tenant Resources',
            icon: 'pi pi-fw pi-bolt',
            data: 'External System Created Tenant Resources',
          },
        ],
      },
    ]
  },
}
