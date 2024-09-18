export const getLabelDetails = (env) => {
  const lowerCasedEnv = String(env).toLowerCase()
  switch (lowerCasedEnv) {
    case 'dev':
      return {
        color: 'var(--white-pure)',
        background: 'var(--dark-blue)',
        value: 'Dev',
      }
    case 'stage':
      return {
        color: 'var(--white-pure)',
        background: 'var(--purple-shade)',
        value: 'Stage',
      }
    case 'production':
      return {
        color: 'var(--white-pure)',
        background: 'var(--green-primary)',
        value: 'Production',
      }
    case 'sandbox':
      return {
        color: 'var(--white-pure)',
        background: 'var(--orange-warm)',
        value: 'Sandbox',
      }
      case 'localhost':
        return {
          color: 'var(--white-pure)',
          background: 'var(--red-alert)',
          value: 'Localhost',
        }
        case 'development':
          return {
            color: 'var(--white-pure)',
            background: 'var(--red-alert)',
            value: 'Development',
          }
    default:
      return {
        color: 'var(--white-pure)',
        background: 'var(--gray-neutral)',
        value: env,
      }
  }
}
export const getEnvironmentNameByFrontendHost = (frontendHost) => {
  const lowerCasedHost = String(frontendHost).toLowerCase()

  switch (lowerCasedHost) {
    case 'dev-fe.rosas.roaatech.com':
      return 'dev'
    case 'stg.rosaas.app':
      return 'stage'
    case 'sb.rosaas.app':
      return 'sandbox'
    case 'dashboard.rosaas.app':
      return 'production'
    case 'localhost':
      return 'localhost'
    default:
      return frontendHost
  }
}
export const getEnvironmentNameByApiHost = (apiHost) => {
  switch (apiHost) {
    case 'dev.rosas.roaa.tech':
      return 'dev'
    case 'api-stg.rosaas.app':
      return 'stage'
    case 'api-sb.rosaas.app':
      return 'sandbox'
    case 'api.rosaas.app':
      return 'production'
    case 'localhost':
      return 'localhost'
    default:
      return apiHost
  }
}
