import { differenceInCalendarDays, format as formatDate } from 'date-fns';
import React, { ReactElement, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCtx, OptionCtx } from '../Store';
import { CloseButton, Info, InfoLabel, InfoText, Text, Wrapper, } from '../TopBar/styled';
import TopBarFeedback from '../TopBarFeedback';
import { TopBarProps } from '../typings';

const TopBar = ({ handleClose }: TopBarProps): ReactElement => {
  const { t } = useTranslation();
  const { start, end } = useContext(CalendarCtx);
  const { format, locale } = useContext(OptionCtx);
  const nightCount = start && end ? differenceInCalendarDays(end, start) : 0;
  return (
    <Wrapper>
      <Text>
        {start && (
          <Info>
            <InfoLabel>{t('selected')}&nbsp;</InfoLabel>
            <InfoText className="start-day">
              {formatDate(start, format, { locale })}
            </InfoText>
            <InfoText> - </InfoText>
            <InfoText className="end-day">
              {end ? formatDate(end, format) : '...'}
            </InfoText>
            {end && (
              <InfoText className="selected-days">
                ({t('night', { count: nightCount })})
              </InfoText>
            )}
          </Info>
        )}
        <TopBarFeedback />
      </Text>
      <CloseButton onClick={handleClose}>{t('button')}</CloseButton>
    </Wrapper>
  );
};

export default TopBar;
