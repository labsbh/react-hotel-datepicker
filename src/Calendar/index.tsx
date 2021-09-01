import clsx from 'clsx';
import { addMonths, differenceInCalendarMonths, startOfMonth, subMonths, } from 'date-fns';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { breakpoints } from '../device';
import { useBreakpointsUp } from '../hooks';
import Month from '../Month';
import { OptionCtx } from '../Store';
import Tooltip from '../Tooltip';
import TopBar from '../TopBar';
import { CalendarProps } from '../typings';
import { DatePickerInner, Months, Wrapper } from './styled';

const Calendar = ({ handleClose, isOpen }: CalendarProps): ReactElement => {
  const responsive = useBreakpointsUp(breakpoints);
  const { laptop } = responsive;
  const { showTopBar, startDate, endDate, moveBothMonths } =
    useContext(OptionCtx);

  const [firstMonth, setFirstMonth] = useState<Date>(startDate);
  const [secondMonth, setSecondMonth] = useState<Date>(addMonths(startDate, 1));
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    let defaultTime = new Date();
    if (startDate && differenceInCalendarMonths(defaultTime, startDate) < 0) {
      defaultTime = new Date(startDate.getTime());
    }

    if (
      endDate &&
      differenceInCalendarMonths(addMonths(defaultTime, 1), endDate) > 0
    ) {
      defaultTime = new Date(subMonths(endDate, 1));
    }

    setFirstMonth(defaultTime);
    setSecondMonth(addMonths(defaultTime, 1));
  }, [startDate, endDate]);

  useEffect(() => {
    if (startOfMonth(firstMonth) >= startOfMonth(secondMonth)) {
      setSecondMonth(addMonths(firstMonth, 1));
    }
  }, [firstMonth, secondMonth]);

  useEffect(() => {
    setIsRender(true);
  }, []);

  const classes = clsx({ closed: !isOpen, rendered: isRender });

  return (
    <React.Fragment>
      <Wrapper className={classes}>
        <DatePickerInner>
          {showTopBar && <TopBar handleClose={handleClose} />}
          <Months>
            <Month
              first
              date={firstMonth}
              nextMonth={laptop ? secondMonth : undefined}
              goToPreviousMonth={(): void => {
                setFirstMonth(subMonths(firstMonth, 1));
                if (moveBothMonths) {
                  setSecondMonth(subMonths(secondMonth, 1));
                }
              }}
              goToNextMonth={(): void => {
                setFirstMonth(addMonths(firstMonth, 1));
                if (moveBothMonths) {
                  setSecondMonth(addMonths(secondMonth, 1));
                }
              }}
            />
            <Month
              first={false}
              date={secondMonth}
              previousMonth={firstMonth}
              goToPreviousMonth={(): void => {
                setSecondMonth(subMonths(secondMonth, 1));
                if (moveBothMonths) {
                  setFirstMonth(subMonths(firstMonth, 1));
                }
              }}
              goToNextMonth={(): void => {
                setSecondMonth(addMonths(secondMonth, 1));
                if (moveBothMonths) {
                  setFirstMonth(addMonths(firstMonth, 1));
                }
              }}
            />
            <Tooltip />
          </Months>
        </DatePickerInner>
      </Wrapper>
    </React.Fragment>
  );
};

export default Calendar;
