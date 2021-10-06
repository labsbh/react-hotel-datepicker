import { differenceInCalendarDays, format as formatDate } from 'date-fns';
import React, { ReactElement, useContext } from 'react';
import { CalendarCtx, OptionCtx } from '../Store';
import { CloseButton, Info, InfoLabel, InfoText, Text, Wrapper, } from '../TopBar/styled';
import TopBarFeedback from '../TopBarFeedback';
import { TopBarProps } from '../typings';

const TopBar = ({ handleClose }: TopBarProps): ReactElement => {
    const { start, end } = useContext(CalendarCtx);
    const { format, locale, i18n } = useContext(OptionCtx);
    const nightCount = start && end ? differenceInCalendarDays(end, start) : 0;
    return (
        <Wrapper>
            <Text>
                {start && (
                    <Info>
                        <InfoLabel>{i18n.selected}&nbsp;</InfoLabel>
                        <InfoText className="start-day">
                            {formatDate(start, format, { locale })}
                        </InfoText>
                        <InfoText> - </InfoText>
                        <InfoText className="end-day">
                            {end ? formatDate(end, format) : '...'}
                        </InfoText>
                        {end && (
                            <InfoText className="selected-days">
                                (<span dangerouslySetInnerHTML={{ __html: (nightCount > 1 ? i18n.night_plural : i18n.night).replace('{{count}}', nightCount.toString()) }} />)
                            </InfoText>
                        )}
                    </Info>
                )}
                <TopBarFeedback />
            </Text>
            <CloseButton onClick={handleClose}>{i18n.button}</CloseButton>
        </Wrapper>
    );
};

export default TopBar;
