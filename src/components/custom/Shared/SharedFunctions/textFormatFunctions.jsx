import { OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap'

export const truncateText = (text, maxCharSize) => {
  if (maxCharSize && text.length > maxCharSize) {
    return `${text.substring(0, maxCharSize)}...`
  }
  return text
}
const TruncateTextWithTooltip = ({ text, maxCharSize }) => {
  const truncatedText = truncateText(text, maxCharSize)

  if (maxCharSize && text.length > maxCharSize) {
    return (
      <OverlayTrigger overlay={<Tooltip>{text}</Tooltip>}>
        <span>{truncatedText}</span>
      </OverlayTrigger>
    )
  }

  return <span>{text}</span>
}

export default TruncateTextWithTooltip
