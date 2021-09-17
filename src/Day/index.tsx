import clsx from 'clsx';
import { differenceInCalendarDays, isSameDay } from 'date-fns';
import React, { ReactElement, useCallback, useContext, useRef } from 'react';
import { CalendarCtx, OptionCtx } from '../Store';
import { DayProps, MonthDayInfos } from '../typings';
import { DayWrapper } from './styled';

const Day = (props: DayProps): ReactElement => {
  const {
    date,
    type,
    isValid,
    isToday,
    isDisabled,
    isFirstDisabledDate,
    isDayBeforeDisabledDate,
    isStartDate,
    isFirstEnabledDate,
    isNoCheckIn,
    isNoCheckOut,
    isDayOfWeekDisabled,
  } = props;
  const { enableCheckout, onSelectRange, onDayClick } = useContext(OptionCtx);
  const { start, end, dayHover, setStart, setEnd, setDayHover } =
    useContext(CalendarCtx);
  const classes = clsx({
    [`type-${type}`]: true,
    valid: isValid,
    invalid: !isValid,
    today: isToday,
    disabled: isDisabled,
    'checkout-enabled': isDisabled && enableCheckout && isFirstDisabledDate,
    'before-disabled-date': isDayBeforeDisabledDate,
    'checkin-only': isStartDate || isFirstEnabledDate,
    'no-checkin': isNoCheckIn,
    'no-checkout': isNoCheckOut,
    'day-of-week-disable': isDayOfWeekDisabled,
  });
  const ref = useRef<HTMLTableDataCellElement>(null);

  let isHover = false;

  if (start) {
    if (end) {
      isHover =
        differenceInCalendarDays(date, start) > 0 &&
        differenceInCalendarDays(end, date) > 0;
    } else if (dayHover && dayHover.isValid) {
      if (start > dayHover.date) {
        isHover =
          dayHover &&
          differenceInCalendarDays(date, dayHover.date) >= 0 &&
          differenceInCalendarDays(date, start) < 0;
      } else {
        isHover =
          dayHover &&
          differenceInCalendarDays(date, dayHover.date) <= 0 &&
          differenceInCalendarDays(date, start) > 0;
      }
    }
  }

  const handleDayClick = useCallback(
    (day: MonthDayInfos, isNoCheckIn: boolean, isNoCheckOut: boolean): void => {
      if (!day.isValid) {
        return;
      }
      let _start = !start ? start : new Date(start.valueOf());
      let _end = !end ? end : new Date(end.valueOf());
      const isSelectStart = (_start && _end) || (!_start && !_end);
      if (isSelectStart) {
        if (isNoCheckIn) {
          return;
        }
        _start = day.date;
        _end = false;
        onDayClick && onDayClick(day.date);
      } else if (_start) {
        if (isNoCheckOut || isSameDay(_start, date)) {
          return;
        }
        _end = day.date;
        onDayClick && onDayClick(day.date);
      }

      if (_start && _end && _start > _end) {
        const tmp = _end;
        _end = _start;
        _start = tmp;
      }

      setStart(_start);
      setEnd(_end);
      if (_start && _end) {
        setDayHover(false);
        onSelectRange && onSelectRange(_start, _end);
      }
    },
    [start, end, setStart, setEnd, onDayClick, date, setDayHover, onSelectRange],
  );

  const handleDayHover = useCallback(
    (day: MonthDayInfos) => {
      if (!ref) {
        return;
      }
      if (!start || (start && end)) {
        setDayHover(false);
      }
      setDayHover({ ...day, ref });
    },
    [start, end, setDayHover],
  );

  return (
    <DayWrapper
      selected={
        (start && isSameDay(start, date)) || (end && isSameDay(end, date))
      }
      hover={isHover}
      className={classes}
      onClick={(): any => handleDayClick(props, isNoCheckIn, isNoCheckOut)}
      onMouseEnter={(): any => {
        return isValid ? handleDayHover(props) : null;
      }}
      ref={ref}
    >
      {date.getDate()}
    </DayWrapper>
  );
};

export default Day;
