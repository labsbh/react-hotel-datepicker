import {
  addDays,
  differenceInCalendarDays,
  differenceInMilliseconds,
  format as formatDate,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subDays,
} from 'date-fns';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCtx, OptionCtx } from '../Store';
import { DayMonthType, DayOfMonth } from '../typings';

let consecutiveDisableDates = 0;
let lastDisabledDate: Date | undefined;

const useClosest = (): ((_date: Date) => [Date | false, Date | false]) => {
  const { disabledDates, enableCheckout } = useContext(OptionCtx);
  return useCallback(
    (date: Date) => {
      let dates: [Date | false, Date | false] = [false, false];
      if (date < disabledDates[0]) {
        dates = [false, addDays(disabledDates[0], enableCheckout ? 1 : 0)];
      } else if (date > disabledDates[disabledDates.length - 1]) {
        dates = [disabledDates[disabledDates.length - 1], false];
      } else {
        let bestPrevDate = disabledDates.length;
        let bestNextDate = disabledDates.length;
        const maxDateValue = Math.abs(new Date(0, 0, 0).valueOf());
        let bestPrevDiff = maxDateValue;
        let bestNextDiff = -maxDateValue;

        for (let i = 0; i < disabledDates.length; ++i) {
          const currentDiff = differenceInMilliseconds(date, disabledDates[i]);
          if (currentDiff < 0 && currentDiff > bestNextDiff) {
            bestNextDate = i;
            bestNextDiff = currentDiff;
          }

          if (currentDiff > 0 && currentDiff < bestPrevDiff) {
            bestPrevDate = i;
            bestPrevDiff = currentDiff;
          }
        }

        if (disabledDates[bestPrevDiff]) {
          dates[0] = disabledDates[bestPrevDiff];
        }

        if (typeof disabledDates[bestPrevDate] === 'undefined') {
          dates[1] = false;
        } else {
          dates[1] = addDays(
            disabledDates[bestNextDate],
            enableCheckout ? 1 : 0,
          );
        }
      }

      return dates;
    },
    [disabledDates, enableCheckout],
  );
};

const useIsValidDate = (): ((time: Date) => boolean) => {
  const getClosest = useClosest();
  const { startDate, endDate, maxDays, minDays, selectForward, disabledDates } =
    useContext(OptionCtx);
  const { start, end } = useContext(CalendarCtx);
  return useCallback(
    (time: Date): boolean => {
      if (
        (startDate && differenceInCalendarDays(time, startDate) < 0) ||
        (endDate && differenceInCalendarDays(time, endDate) > 0)
      ) {
        return false;
      }

      if (start && !end) {
        const diff = Math.abs(differenceInCalendarDays(time, start));
        if (
          (maxDays > 0 && diff > maxDays - 1) ||
          (minDays > 0 && !isSameDay(time, start) && diff < minDays - 1)
        ) {
          return false;
        }
        if (selectForward && time < start) {
          return false;
        }
        if (disabledDates.length > 0) {
          const limit = getClosest(start);
          if (limit[0] && differenceInCalendarDays(time, limit[0]) <= 0) {
            return false;
          }
          if (limit[1] && differenceInCalendarDays(time, limit[1]) >= 0) {
            return false;
          }
        }
      }

      return true;
    },
    [startDate, endDate, start, end, maxDays, minDays, selectForward, disabledDates.length, getClosest],
  );
};

const useDayProperties = (): ((
  date: Date,
  type: DayMonthType,
) => DayOfMonth) => {
  const {
    startDate,
    disabledDates,
    selectForward,
    minDays,
    enableCheckout,
    disabledDaysOfWeek,
    noCheckInDates,
    noCheckOutDates,
  } = useContext(OptionCtx);
  const { t } = useTranslation('hoteldatepicker');
  const isValidDate = useIsValidDate();
  const getClosest = useClosest();

  return useCallback(
    (date: Date, type: DayMonthType): DayOfMonth => {
      const isToday = differenceInCalendarDays(date, new Date()) === 0;
      const isStartDate = startDate ? isSameDay(date, startDate) : false;
      let isValid = isValidDate(date);
      let isDayBeforeDisabledDate = false;
      let isDisabled = false;
      let isFirstEnabledDate = false;
      let isDayOfWeekDisabled = false;
      let isNoCheckIn = false;
      let isNoCheckOut = false;
      if (isValid || type === 'visibleMonth') {
        if (disabledDates.length > 0) {
          const limit = getClosest(date);
          if (limit[0] && limit[1]) {
            if (
              !isSameDay(date, limit[0]) &&
              Math.abs(differenceInCalendarDays(limit[1], limit[0])) > 2
            ) {
              const daysBeforeNextDisabledDate =
                differenceInCalendarDays(limit[1], date) - 1;
              const daysAfterPreviousDisabledDate =
                differenceInCalendarDays(date, limit[0]) - 1;
              if (selectForward && daysBeforeNextDisabledDate < minDays) {
                isValid = false;
              } else if (
                !selectForward &&
                daysBeforeNextDisabledDate < minDays &&
                daysAfterPreviousDisabledDate < minDays
              ) {
                isValid = false;
              }

              if (
                !isValid &&
                enableCheckout &&
                daysBeforeNextDisabledDate === 2
              ) {
                isDayBeforeDisabledDate = true;
              }
            }
          }

          const isDisabledDate =
            disabledDates.findIndex((disabledDate) =>
              isSameDay(disabledDate, date),
            ) !== -1;
          if (isDisabledDate) {
            isValid = false;
            isDisabled = true;
            consecutiveDisableDates++;
            lastDisabledDate = date;
          } else {
            consecutiveDisableDates = 0;
          }

          if (
            isValid &&
            lastDisabledDate &&
            Math.abs(differenceInCalendarDays(date, lastDisabledDate)) === 2
          ) {
            isFirstEnabledDate = true;
          }
        }

        if (
          disabledDaysOfWeek.indexOf(parseInt(formatDate(date, 'i'), 10) - 1) >
          -1
        ) {
          isValid = false;
          isDayOfWeekDisabled = true;
        }

        if (
          noCheckInDates.findIndex((noCheckInDate) =>
            isSameDay(noCheckInDate, date),
          ) > -1
        ) {
          isNoCheckIn = true;
          isFirstEnabledDate = false;
        }

        if (
          noCheckOutDates.findIndex((noCheckOutDate) =>
            isSameDay(noCheckOutDate, date),
          ) > -1
        ) {
          isNoCheckOut = true;
          isFirstEnabledDate = false;
        }
      }

      let title = '';
      if (isNoCheckIn) {
        title = t('hoteldatepicker:checkin-disabled');
      }

      if (isNoCheckOut) {
        if (title) {
          title += '. ';
        }
        title = t('hoteldatepicker:checkout-disabled');
      }

      return {
        date,
        title,
        type,
        isValid,
        isToday,
        isStartDate,
        isDayBeforeDisabledDate,
        isDisabled,
        isFirstEnabledDate,
        isDayOfWeekDisabled,
        isNoCheckIn,
        isNoCheckOut,
        isFirstDisabledDate: consecutiveDisableDates === 1,
      };
    },
    [startDate, isValidDate, disabledDates, disabledDaysOfWeek, noCheckInDates, noCheckOutDates, getClosest, selectForward, minDays, enableCheckout, t],
  );
};

const useDays = (month: Date): Array<DayOfMonth> => {
  const { locale } = useContext(OptionCtx);
  const getDayProperties = useDayProperties();

  const days: Array<DayOfMonth> = [];
  const _month = startOfMonth(month);
  const dayOfWeek =
    _month.getDay() === 0 && locale.options?.weekStartsOn === 1
      ? 7
      : _month.getDay();

  for (let i = dayOfWeek; i > 0; i--) {
    const day = subDays(_month, i);
    days.push(getDayProperties(day, 'lastMonth'));
  }

  for (let i = 0; i < 40; i++) {
    const day = addDays(_month, i);
    days.push(
      getDayProperties(
        day,
        isSameMonth(day, month) ? 'visibleMonth' : 'nextMonth',
      ),
    );
  }

  return days;
};

export { useDays };
