import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcVisa,
} from '@fortawesome/free-brands-svg-icons'
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons'

export const cardInfo = {
  visa: {
    icon: <FontAwesomeIcon icon={faCcVisa} />,
  },
  mastercard: {
    icon: <FontAwesomeIcon icon={faCcMastercard} />,
  },
  amex: {
    icon: <FontAwesomeIcon icon={faCcAmex} />,
  },
  diners: {
    icon: <FontAwesomeIcon icon={faCcDinersClub} />,
  },
  discover: {
    icon: <FontAwesomeIcon icon={faCcDiscover} />,
  },
  jcb: {
    icon: <FontAwesomeIcon icon={faCcJcb} />,
  },
  unionpay: {
    icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />,
  },
  cartes_bancaires: {
    icon: <FontAwesomeIcon icon={faMoneyCheckDollar} />,
  },
}
