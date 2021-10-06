import React, { ReactElement, useContext } from 'react';
import { CalendarCtx, OptionCtx } from '../Store';

const TopBarFeedback = (): ReactElement | null => {
    const { minDays, maxDays, i18n } = useContext(OptionCtx);
    const { start, end } = useContext(CalendarCtx);

    if (start && end) {
        return null;
    }

    let text = i18n.infoDefault;
    if (minDays && maxDays) {
        text = i18n.infoRange.replace('{{min}}', ( minDays - 1).toString()).replace('{{max}}', ( maxDays - 1).toString());
    } else if (minDays) {
        const count = minDays - 1;
        text = (count > 1 ? i18n.infoMore_plural : i18n.infoMore).replace('{{count}}', count.toString());
    }

    return <div dangerouslySetInnerHTML={{ __html: text }} />;
};

export default TopBarFeedback;
