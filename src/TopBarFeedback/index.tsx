import React, { ReactElement, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCtx, OptionCtx } from '../Store';

const TopBarFeedback = (): ReactElement | null => {
  const { t } = useTranslation();
  const { minDays, maxDays } = useContext(OptionCtx);
  const { start, end } = useContext(CalendarCtx);

  if (start && end) {
    return null;
  }

  let text = '';
  if (minDays && maxDays) {
    text = t('infoRange', { min: minDays - 1, max: maxDays - 1 });
  } else if (minDays) {
    text = t('infoMore', { count: minDays - 1 });
  } else {
    text = t('infoDefault');
  }

  return <div>{text}</div>;
};

export default TopBarFeedback;
