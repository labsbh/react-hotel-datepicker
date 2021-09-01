/* eslint-disable @typescript-eslint/no-empty-function */
import { enUS } from 'date-fns/locale';
import { createContext } from 'react';
import { CalendarContext, OptionContext } from '../typings';

const defaultOptions: OptionContext = {
  locale: enUS,
  format: 'P',
  startDate: new Date(),
  endDate: false,
  minDays: 2,
  maxDays: 0,
  selectForward: false,
  disabledDates: [],
  noCheckInDates: [],
  noCheckOutDates: [],
  disabledDaysOfWeek: [],
  enableCheckout: false,
  preventContainerClose: false,
  hoveringTooltip: true,
  autoClose: true,
  showTopBar: true,
  moveBothMonths: true,
  onDayClick: undefined,
  onSelectRange: undefined,
};

const defaultCalendar: CalendarContext = {
  start: false,
  end: false,
  dayHover: false,
  setStart: (_value) => {},
  setEnd: (_value) => {},
  setDayHover: (_value) => {},
};

const OptionCtx = createContext<OptionContext>(defaultOptions);
const CalendarCtx = createContext<CalendarContext>(defaultCalendar);

export { defaultOptions, OptionCtx, CalendarCtx };
