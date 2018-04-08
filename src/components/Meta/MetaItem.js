import styled from 'styled-components';

import { spacing } from '../../styles-old/settings/spacing';
import { colors } from '../../styles-old/settings/colors';
import { fontWeightSemibold } from '../../styles-old/settings/typography';

export const MetaItem = styled.span`
  white-space: nowrap;

  &:not(:first-child) {
    margin-left: ${spacing(2)};
    padding-left: ${spacing(2)};
    border-left: 1px solid ${colors.neutral['50']};
  }
`;

export const Score = styled(MetaItem)`
  font-weight: ${fontWeightSemibold};
`;

// Truncate the username when there's no enough space
export const Author = styled(MetaItem)`
  overflow: hidden;
  text-overflow: ellipsis;
`;


