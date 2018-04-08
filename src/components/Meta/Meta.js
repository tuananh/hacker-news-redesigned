import styled from 'styled-components';
import { fontSizeExtraSmall, fontSizeSmall } from '../../styles-old/settings/typography';
import { spacing } from '../../styles-old/settings/spacing';
import { colors } from '../../styles-old/settings/colors';

const Meta = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: ${(props) => props.small ? fontSizeExtraSmall : fontSizeSmall};
  line-height: ${spacing(5)};
  color: ${colors.neutral['40']};
`;

export default Meta;
