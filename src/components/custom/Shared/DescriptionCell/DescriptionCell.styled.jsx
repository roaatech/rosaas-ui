import styled from 'styled-components';


export const DescriptionCellWrapper = styled.div`
.description-text {
  max-height: ${(props) => props.maxheight};
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.show-more-link {
  cursor: pointer;
  color: var(--second-color);
  transition: color 0.3s ease, transform 0.3s ease;
  font-size:var(--smallFont);
  line-height: 5px;
}

.expanded .description-text {
  max-height: none;
}
`;
