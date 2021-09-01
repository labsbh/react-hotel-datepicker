import { differenceInCalendarDays } from 'date-fns';
import React, { ReactElement, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCtx, OptionCtx } from '../Store';
import { TooltipWrapper } from './styled';

const Tooltip = (): ReactElement | null => {
  const { t } = useTranslation();
  const { hoveringTooltip: hoveringTooltipOption } = useContext(OptionCtx);
  const { start, end, dayHover } = useContext(CalendarCtx);
  const [hoveringTooltip] = useState(
    hoveringTooltipOption &&
      !(
        (typeof window !== 'undefined' && 'ontouchstart' in window) ||
        typeof navigator === 'undefined' ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      ),
  );

  if (!hoveringTooltip || !dayHover || !start || end) {
    return null;
  }

  const nightCount =
    start && dayHover
      ? Math.abs(differenceInCalendarDays(dayHover.date, start))
      : 0;

  if (nightCount <= 0) {
    return null;
  }

  let top = 0;
  let left = 0;
  if (dayHover.ref.current) {
    const { offsetLeft, offsetTop, offsetWidth } = dayHover.ref.current;
    const parent = dayHover.ref.current.closest('table');
    const { offsetLeft: parentLeft, offsetTop: parentTop } = parent || {
      offsetLeft: 0,
      offsetTop: 0,
    };
    top = parentTop + offsetTop;
    left = parentLeft + offsetLeft + offsetWidth / 2;
  }

  return (
    <TooltipWrapper style={{ left, top }}>
      {typeof hoveringTooltipOption === 'function'
        ? hoveringTooltipOption(nightCount, start, dayHover.date)
        : t('night', { count: nightCount })}
    </TooltipWrapper>
  );
};

export default Tooltip;
