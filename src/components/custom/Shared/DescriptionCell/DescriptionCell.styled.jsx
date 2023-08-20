import styled from 'styled-components';


export const DescriptionCellWrapper = styled.div`
.description-text {
  max-height: ${(props) => props.maxheight};
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.show-more-link {
  cursor: pointer;
  color: #ffab03;
  transition: color 0.3s ease, transform 0.3s ease;
}

.expanded .description-text {
  max-height: none;
}
`;
