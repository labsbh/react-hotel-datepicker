import { jsx, jsxs } from 'react/jsx-runtime';
import { differenceInCalendarDays, isSameDay, format, startOfMonth, subDays, addDays, isSameMonth, differenceInMilliseconds, subMonths, addMonths, differenceInCalendarMonths, closestTo, isAfter, differenceInDays, eachDayOfInterval } from 'date-fns';
import _ from 'lodash';
import React, { useEffect, useState, createContext, useContext, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import clsx from 'clsx';
import { enUS } from 'date-fns/locale';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var size = {
    mobileS: 320,
    mobileM: 375,
    mobileL: 480,
    tablet: 768,
    laptop: 1024,
    laptopL: 1440,
    desktop: 2560,
};
var device = {
    mobileS: "(min-width: " + size.mobileS + "px)",
    mobileM: "(min-width: " + size.mobileM + "px)",
    mobileL: "(min-width: " + size.mobileL + "px)",
    tablet: "(min-width: " + size.tablet + "px)",
    laptop: "(min-width: " + size.laptop + "px)",
    laptopL: "(min-width: " + size.laptopL + "px)",
    desktop: "(min-width: " + size.desktop + "px)",
    desktopL: "(min-width: " + size.desktop + "px)",
};
var breakpoints = {
    mobileS: { min: 0, max: size.mobileS },
    mobileM: { min: size.mobileS + 1, max: size.mobileM },
    mobileL: { min: size.mobileM + 1, max: size.mobileL },
    tablet: { min: size.mobileL + 1, max: size.tablet },
    laptop: { min: size.tablet + 1, max: size.laptop },
    laptopL: { min: size.laptop + 1, max: size.laptopL },
    desktop: { min: size.laptopL + 1, max: size.desktop },
    desktopL: { min: size.desktop + 1, max: null },
};

var getWidth = function () {
    return typeof window === 'undefined'
        ? 0
        : window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
};
var useOutsideListener = function (ref, onClickOutside, preventContainerClose) {
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (!preventContainerClose &&
                ref.current &&
                !ref.current.contains(event.target)) {
                onClickOutside();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            return document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClickOutside, preventContainerClose]);
};
var useCurrentWidth = function () {
    var _a = useState(getWidth()), width = _a[0], setWidth = _a[1];
    useEffect(function () {
        var timeout = null;
        var resizeListener = function () {
            if (typeof window !== 'undefined') {
                if (timeout) {
                    window.clearTimeout(timeout);
                }
                timeout = window.setTimeout(function () { return setWidth(getWidth()); }, 150);
            }
        };
        window.addEventListener('resize', resizeListener);
        return function () {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', resizeListener);
            }
        };
    }, []);
    return width;
};
var useBreakpointsUp = function (breakpoints) {
    var width = useCurrentWidth();
    return Object.keys(breakpoints).reduce(function (result, key) {
        var min = breakpoints[key].min;
        result[key] = width >= min;
        return result;
    }, {});
};

var selected = "Your stay:";
var night = "{{count}} Night";
var night_plural = "{{count}} Nights";
var button = "Close";
var infoMore = "Please select a date range of at least 1 night";
var infoMore_plural = "Please select a date range of at least {{count}} nights";
var infoRange = "Please select a date range between {{min}} and {{max}} nights";
var infoDefault = "Please select a date range";
var enTranslations = {
	selected: selected,
	night: night,
	night_plural: night_plural,
	button: button,
	infoMore: infoMore,
	infoMore_plural: infoMore_plural,
	infoRange: infoRange,
	infoDefault: infoDefault
};

/* eslint-disable @typescript-eslint/no-empty-function */
var defaultOptions = {
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
    i18n: enTranslations,
};
var defaultCalendar = {
    start: false,
    end: false,
    dayHover: false,
    setStart: function (_value) {
    },
    setEnd: function (_value) {
    },
    setDayHover: function (_value) {
    },
};
var OptionCtx = createContext(defaultOptions);
var CalendarCtx = createContext(defaultCalendar);

var theme = {
    fontFamily: "'Helvetica', 'Helvetica Neue', 'Arial', sans-serif",
    animationSpeed: '0.2s',
    calendar: {
        backgroundColor: '#fff',
        border: '0 none',
        borderRadius: '5px',
        boxShadow: '8px 8px 40px 5px rgba(0, 0, 0, 0.08)',
        color: '#484c55',
        fontSize: '14px',
        lineHeight: '14px',
        padding: '20px',
        widths: {
            sm: '100%',
            md: '460px',
            lg: '560px',
        },
    },
    months: {
        spacer: {
            color: '#dcdcdc',
            width: '1px',
        },
        table: {
            fontSize: '12px',
            borderColor: '#dcdcdc',
            caption: {
                height: '2.5rem',
            },
            navButton: {
                backgroundColor: {
                    base: 'rgba(214, 218, 229, 1)',
                    hover: 'rgba(116, 107, 253, 1)',
                },
                textColor: {
                    base: 'rgba(157, 166, 184, 1)',
                    hover: 'rgba(255, 255, 255, 1)',
                },
            },
            weekDays: {
                height: '2rem',
                fontSize: '11px',
                fontWeight: '400',
            },
            widths: {
                sm: '100%',
                md: '180px',
                lg: '230px',
            },
        },
    },
    days: {
        textColor: '#acb2c1',
        padding: '9px 7px',
        selected: {
            textColor: '#ffffff',
            backgroundColor: {
                base: 'rgba(116, 107, 253, 1)',
                hover: 'rgba(116, 107, 253, 0.2)',
            },
        },
        today: {
            textColor: '#ffffff',
            backgroundColor: '#484c55',
        },
        noCheckIn: {
            textColor: '#acb2c1',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
        },
        noCheckOut: {
            textColor: '#acb2c1',
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
        },
        invalid: {
            textColor: '#e8ebf4',
            backgroundColor: 'transparent',
        },
        disabled: {
            textColor: '#e8ebf4',
            backgroundColor: 'transparent',
            crossColor: '#ff0000',
        },
        dowDisabled: {
            textColor: '#e8ebf4',
            backgroundColor: 'rgba(232, 235, 244, 0.5)',
        },
    },
    tooltip: {
        backgroundColor: '#ffe684',
        textColor: '#484c55',
        borderRadius: '2px',
        fontSize: '11px',
        padding: '5px 10px',
    },
    topBar: {
        backgroundColor: 'transparent',
        textColor: '#acb2c1',
        closeButton: {
            backgroundColor: {
                base: '#746bfd',
                hover: '#484c55',
            },
            textColor: {
                base: '#ffffff',
                hover: '#ffffff',
            },
        },
    },
    // colors: {
    //   background: '#fff',
    //   textBase: '#484c55',
    //   textLight: '#acb2c1',
    //   lineBorder: '#dcdcdc',
    //   button: {
    //     background: '#d6dae5',
    //     text: '#9da6b8',
    //     hover: {
    //       background: '#746bfd',
    //       text: '#ffffff',
    //     },
    //   },
    //   tooltip: '#ffe684',
    //   checkInDisabled: '#ff0000',
    //   checkOutDisabled: '#ff0000',
    //   invalidDate: '#e8ebf4',
    //   disabledDate: '#e8ebf4',
    //   disabledCross: 'red',
    //   selectedDate: '#746bfd',
    // },
};
var transition = "\n  transition-duration: 0.2s;\n  transition-property: color, background-color, border-color;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n";
var Wrapper$2 = styled.div(templateObject_1$5 || (templateObject_1$5 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var templateObject_1$5;

var DayWrapper = styled.td.attrs(function (_a) {
    var className = _a.className;
    return ({
        className: (className || '') + " day"
    });
})(templateObject_1$4 || (templateObject_1$4 = __makeTemplateObject(["\n  background-color: ", ";\n  color: ", ";\n  padding: ", ";\n  ", "\n\n  &.valid {\n    cursor: pointer;\n  }\n\n  &.no-checkin {\n    color: ", ";\n    position: relative;\n\n    &:after {\n      background-color: ", ";\n      bottom: 0;\n      content: '';\n      display: block;\n      left: 50%;\n      position: absolute;\n      right: 0;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  &.no-checkout {\n    color: ", ";\n    position: relative;\n\n    &:after {\n      background-color: ", ";\n      bottom: 0;\n      content: '';\n      display: block;\n      left: 0;\n      position: absolute;\n      right: 50%;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  &.invalid {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  &.disabled {\n    background-color: ", ";\n    color: ", ";\n    position: relative;\n\n    &:after {\n      content: '\\00d7';\n      left: 50%;\n      position: absolute;\n      color: ", ";\n      font-size: 16px;\n      top: 50%;\n      transform: translate(-50%, -50%);\n    }\n  }\n\n  &.day-of-week-disabled {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  &.today {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  &.type-lastMonth,\n  &.type-nextMonth {\n    visibility: hidden;\n  }\n"], ["\n  background-color: ", ";\n  color: ", ";\n  padding: ", ";\n  ", "\n\n  &.valid {\n    cursor: pointer;\n  }\n\n  &.no-checkin {\n    color: ", ";\n    position: relative;\n\n    &:after {\n      background-color: ", ";\n      bottom: 0;\n      content: '';\n      display: block;\n      left: 50%;\n      position: absolute;\n      right: 0;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  &.no-checkout {\n    color: ", ";\n    position: relative;\n\n    &:after {\n      background-color: ", ";\n      bottom: 0;\n      content: '';\n      display: block;\n      left: 0;\n      position: absolute;\n      right: 50%;\n      top: 0;\n      z-index: -1;\n    }\n  }\n\n  &.invalid {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  &.disabled {\n    background-color: ", ";\n    color: ", ";\n    position: relative;\n\n    &:after {\n      content: '\\\\00d7';\n      left: 50%;\n      position: absolute;\n      color: ", ";\n      font-size: 16px;\n      top: 50%;\n      transform: translate(-50%, -50%);\n    }\n  }\n\n  &.day-of-week-disabled {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  &.today {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  &.type-lastMonth,\n  &.type-nextMonth {\n    visibility: hidden;\n  }\n"])), function (props) {
    return props.selected
        ? props.theme.days.selected.backgroundColor.base
        : props.hover
            ? props.theme.days.selected.backgroundColor.hover
            : 'transparent';
}, function (props) {
    return props.selected
        ? props.theme.days.selected.textColor
        : props.theme.days.textColor;
}, function (props) { return props.theme.days.padding; }, transition, function (props) { return props.theme.days.noCheckIn.textColor; }, function (props) {
    return props.theme.days.noCheckIn.backgroundColor;
}, function (props) { return props.theme.days.noCheckOut.textColor; }, function (props) {
    return props.theme.days.noCheckOut.backgroundColor;
}, function (props) {
    return props.theme.days.invalid.backgroundColor;
}, function (props) { return props.theme.days.invalid.textColor; }, function (props) {
    return props.theme.days.disabled.backgroundColor;
}, function (props) { return props.theme.days.disabled.textColor; }, function (props) { return props.theme.days.disabled.crossColor; }, function (props) {
    return props.theme.days.dowDisabled.backgroundColor;
}, function (props) { return props.theme.days.dowDisabled.textColor; }, function (props) {
    return props.selected
        ? props.theme.days.selected.backgroundColor.base
        : props.theme.days.today.backgroundColor;
}, function (props) {
    return props.selected
        ? props.theme.days.selected.textColor
        : props.theme.days.today.textColor;
});
var templateObject_1$4;

var Day = function (props) {
    var _a;
    var date = props.date, type = props.type, isValid = props.isValid, isToday = props.isToday, isDisabled = props.isDisabled, isFirstDisabledDate = props.isFirstDisabledDate, isDayBeforeDisabledDate = props.isDayBeforeDisabledDate, isStartDate = props.isStartDate, isFirstEnabledDate = props.isFirstEnabledDate, isNoCheckIn = props.isNoCheckIn, isNoCheckOut = props.isNoCheckOut, isDayOfWeekDisabled = props.isDayOfWeekDisabled;
    var _b = useContext(OptionCtx), enableCheckout = _b.enableCheckout, onSelectRange = _b.onSelectRange, onDayClick = _b.onDayClick;
    var _c = useContext(CalendarCtx), start = _c.start, end = _c.end, dayHover = _c.dayHover, setStart = _c.setStart, setEnd = _c.setEnd, setDayHover = _c.setDayHover;
    var classes = clsx((_a = {},
        _a["type-" + type] = true,
        _a.valid = isValid,
        _a.invalid = !isValid,
        _a.today = isToday,
        _a.disabled = isDisabled,
        _a['checkout-enabled'] = isDisabled && enableCheckout && isFirstDisabledDate,
        _a['before-disabled-date'] = isDayBeforeDisabledDate,
        _a['checkin-only'] = isStartDate || isFirstEnabledDate,
        _a['no-checkin'] = isNoCheckIn,
        _a['no-checkout'] = isNoCheckOut,
        _a['day-of-week-disable'] = isDayOfWeekDisabled,
        _a));
    var ref = useRef(null);
    var isHover = false;
    if (start) {
        if (end) {
            isHover =
                differenceInCalendarDays(date, start) > 0 &&
                    differenceInCalendarDays(end, date) > 0;
        }
        else if (dayHover && dayHover.isValid) {
            if (start > dayHover.date) {
                isHover =
                    dayHover &&
                        differenceInCalendarDays(date, dayHover.date) >= 0 &&
                        differenceInCalendarDays(date, start) < 0;
            }
            else {
                isHover =
                    dayHover &&
                        differenceInCalendarDays(date, dayHover.date) <= 0 &&
                        differenceInCalendarDays(date, start) > 0;
            }
        }
    }
    var handleDayClick = useCallback(function (day, isNoCheckIn, isNoCheckOut) {
        if (!day.isValid) {
            return;
        }
        var _start = !start ? start : new Date(start.valueOf());
        var _end = !end ? end : new Date(end.valueOf());
        var isSelectStart = (_start && _end) || (!_start && !_end);
        if (isSelectStart) {
            if (isNoCheckIn) {
                return;
            }
            _start = day.date;
            _end = false;
            onDayClick && onDayClick(day.date);
        }
        else if (_start) {
            if (isNoCheckOut || isSameDay(_start, date)) {
                return;
            }
            _end = day.date;
            onDayClick && onDayClick(day.date);
        }
        if (_start && _end && _start > _end) {
            var tmp = _end;
            _end = _start;
            _start = tmp;
        }
        setStart(_start);
        setEnd(_end);
        if (_start && _end) {
            setDayHover(false);
            onSelectRange && onSelectRange(_start, _end);
        }
    }, [start, end, setStart, setEnd, onDayClick, date, setDayHover, onSelectRange]);
    var handleDayHover = useCallback(function (day) {
        if (!ref) {
            return;
        }
        if (!start || (start && end)) {
            setDayHover(false);
        }
        setDayHover(__assign(__assign({}, day), { ref: ref }));
    }, [start, end, setDayHover]);
    return (jsx(DayWrapper, __assign({ selected: (start && isSameDay(start, date)) || (end && isSameDay(end, date)), hover: isHover, className: classes, onClick: function () { return handleDayClick(props, isNoCheckIn, isNoCheckOut); }, onMouseEnter: function () {
            return isValid ? handleDayHover(props) : null;
        }, ref: ref }, { children: date.getDate() }), void 0));
};

var consecutiveDisableDates = 0;
var lastDisabledDate;
var useClosest = function () {
    var _a = useContext(OptionCtx), disabledDates = _a.disabledDates, enableCheckout = _a.enableCheckout;
    return useCallback(function (date) {
        var dates = [false, false];
        if (date < disabledDates[0]) {
            dates = [false, addDays(disabledDates[0], enableCheckout ? 1 : 0)];
        }
        else if (date > disabledDates[disabledDates.length - 1]) {
            dates = [disabledDates[disabledDates.length - 1], false];
        }
        else {
            var bestPrevDate = disabledDates.length;
            var bestNextDate = disabledDates.length;
            var maxDateValue = Math.abs(new Date(0, 0, 0).valueOf());
            var bestPrevDiff = maxDateValue;
            var bestNextDiff = -maxDateValue;
            for (var i = 0; i < disabledDates.length; ++i) {
                var currentDiff = differenceInMilliseconds(date, disabledDates[i]);
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
            }
            else {
                dates[1] = addDays(disabledDates[bestNextDate], enableCheckout ? 1 : 0);
            }
        }
        return dates;
    }, [disabledDates, enableCheckout]);
};
var useIsValidDate = function () {
    var getClosest = useClosest();
    var _a = useContext(OptionCtx), startDate = _a.startDate, endDate = _a.endDate, maxDays = _a.maxDays, minDays = _a.minDays, selectForward = _a.selectForward, disabledDates = _a.disabledDates;
    var _b = useContext(CalendarCtx), start = _b.start, end = _b.end;
    return useCallback(function (time) {
        if ((startDate && differenceInCalendarDays(time, startDate) < 0) ||
            (endDate && differenceInCalendarDays(time, endDate) > 0)) {
            return false;
        }
        if (start && !end) {
            var diff = Math.abs(differenceInCalendarDays(time, start));
            if ((maxDays > 0 && diff > maxDays - 1) ||
                (minDays > 0 && !isSameDay(time, start) && diff < minDays - 1)) {
                return false;
            }
            if (selectForward && time < start) {
                return false;
            }
            if (disabledDates.length > 0) {
                var limit = getClosest(start);
                if (limit[0] && differenceInCalendarDays(time, limit[0]) <= 0) {
                    return false;
                }
                if (limit[1] && differenceInCalendarDays(time, limit[1]) >= 0) {
                    return false;
                }
            }
        }
        return true;
    }, [startDate, endDate, start, end, maxDays, minDays, selectForward, disabledDates.length, getClosest]);
};
var useDayProperties = function () {
    var _a = useContext(OptionCtx), startDate = _a.startDate, disabledDates = _a.disabledDates, selectForward = _a.selectForward, minDays = _a.minDays, enableCheckout = _a.enableCheckout, disabledDaysOfWeek = _a.disabledDaysOfWeek, noCheckInDates = _a.noCheckInDates, noCheckOutDates = _a.noCheckOutDates;
    var isValidDate = useIsValidDate();
    var getClosest = useClosest();
    return useCallback(function (date, type) {
        var isToday = differenceInCalendarDays(date, new Date()) === 0;
        var isStartDate = startDate ? isSameDay(date, startDate) : false;
        var isValid = isValidDate(date);
        var isDayBeforeDisabledDate = false;
        var isDisabled = false;
        var isFirstEnabledDate = false;
        var isDayOfWeekDisabled = false;
        var isNoCheckIn = false;
        var isNoCheckOut = false;
        if (isValid || type === 'visibleMonth') {
            if (disabledDates.length > 0) {
                var limit = getClosest(date);
                if (limit[0] && limit[1]) {
                    if (!isSameDay(date, limit[0]) &&
                        Math.abs(differenceInCalendarDays(limit[1], limit[0])) > 2) {
                        var daysBeforeNextDisabledDate = differenceInCalendarDays(limit[1], date) - 1;
                        var daysAfterPreviousDisabledDate = differenceInCalendarDays(date, limit[0]) - 1;
                        if (selectForward && daysBeforeNextDisabledDate < minDays) {
                            isValid = false;
                        }
                        else if (!selectForward &&
                            daysBeforeNextDisabledDate < minDays &&
                            daysAfterPreviousDisabledDate < minDays) {
                            isValid = false;
                        }
                        if (!isValid &&
                            enableCheckout &&
                            daysBeforeNextDisabledDate === 2) {
                            isDayBeforeDisabledDate = true;
                        }
                    }
                }
                var isDisabledDate = disabledDates.findIndex(function (disabledDate) {
                    return isSameDay(disabledDate, date);
                }) !== -1;
                if (isDisabledDate) {
                    isValid = false;
                    isDisabled = true;
                    consecutiveDisableDates++;
                    lastDisabledDate = date;
                }
                else {
                    consecutiveDisableDates = 0;
                }
                if (isValid &&
                    lastDisabledDate &&
                    Math.abs(differenceInCalendarDays(date, lastDisabledDate)) === 2) {
                    isFirstEnabledDate = true;
                }
            }
            if (disabledDaysOfWeek.indexOf(parseInt(format(date, 'i'), 10) - 1) >
                -1) {
                isValid = false;
                isDayOfWeekDisabled = true;
            }
            if (noCheckInDates.findIndex(function (noCheckInDate) {
                return isSameDay(noCheckInDate, date);
            }) > -1) {
                isNoCheckIn = true;
                isFirstEnabledDate = false;
            }
            if (noCheckOutDates.findIndex(function (noCheckOutDate) {
                return isSameDay(noCheckOutDate, date);
            }) > -1) {
                isNoCheckOut = true;
                isFirstEnabledDate = false;
            }
        }
        var title = '';
        return {
            date: date,
            title: title,
            type: type,
            isValid: isValid,
            isToday: isToday,
            isStartDate: isStartDate,
            isDayBeforeDisabledDate: isDayBeforeDisabledDate,
            isDisabled: isDisabled,
            isFirstEnabledDate: isFirstEnabledDate,
            isDayOfWeekDisabled: isDayOfWeekDisabled,
            isNoCheckIn: isNoCheckIn,
            isNoCheckOut: isNoCheckOut,
            isFirstDisabledDate: consecutiveDisableDates === 1,
        };
    }, [startDate, isValidDate, disabledDates, disabledDaysOfWeek, noCheckInDates, noCheckOutDates, getClosest, selectForward, minDays, enableCheckout]);
};
var useDays = function (month) {
    var _a;
    var locale = useContext(OptionCtx).locale;
    var getDayProperties = useDayProperties();
    var days = [];
    var _month = startOfMonth(month);
    var dayOfWeek = _month.getDay() === 0 && ((_a = locale.options) === null || _a === void 0 ? void 0 : _a.weekStartsOn) === 1
        ? 7
        : _month.getDay();
    for (var i = dayOfWeek; i > 0; i--) {
        var day = subDays(_month, i);
        days.push(getDayProperties(day, 'lastMonth'));
    }
    for (var i = 0; i < 40; i++) {
        var day = addDays(_month, i);
        days.push(getDayProperties(day, isSameMonth(day, month) ? 'visibleMonth' : 'nextMonth'));
    }
    return days;
};

var MonthTable = styled.table(templateObject_1$3 || (templateObject_1$3 = __makeTemplateObject(["\n  border-collapse: collapse;\n  display: ", ";\n  font-size: ", ";\n  position: relative;\n  text-align: center;\n  width: ", ";\n\n  @media only screen and ", " {\n    display: table;\n    float: ", ";\n    width: ", ";\n  }\n\n  @media only screen and ", " {\n    width: ", ";\n  }\n"], ["\n  border-collapse: collapse;\n  display: ", ";\n  font-size: ", ";\n  position: relative;\n  text-align: center;\n  width: ", ";\n\n  @media only screen and ", " {\n    display: table;\n    float: ", ";\n    width: ", ";\n  }\n\n  @media only screen and ", " {\n    width: ", ";\n  }\n"])), function (props) { return (props.first ? 'table' : 'none'); }, function (props) { return props.theme.months.table.fontSize; }, function (props) { return props.theme.months.table.widths.sm; }, device.mobileL, function (props) { return (props.first ? 'left' : 'right'); }, function (props) { return props.theme.months.table.widths.md; }, device.tablet, function (props) { return props.theme.months.table.widths.lg; });
var Caption = styled.tr(templateObject_2$2 || (templateObject_2$2 = __makeTemplateObject(["\n  border-bottom: 1px solid\n    ", ";\n  height: ", ";\n  vertical-align: middle;\n"], ["\n  border-bottom: 1px solid\n    ", ";\n  height: ", ";\n  vertical-align: middle;\n"])), function (props) { return props.theme.months.table.borderColor; }, function (props) { return props.theme.months.table.caption.height; });
var NavButton = styled.span(templateObject_3$2 || (templateObject_3$2 = __makeTemplateObject(["\n  background-color: ", ";\n  border-radius: 4px;\n  color: ", ";\n  cursor: pointer;\n  display: inline-block;\n  padding: 5px 10px;\n  ", "\n\n  &:hover {\n    background-color: ", ";\n    color: ", ";\n  }\n"], ["\n  background-color: ", ";\n  border-radius: 4px;\n  color: ", ";\n  cursor: pointer;\n  display: inline-block;\n  padding: 5px 10px;\n  ", "\n\n  &:hover {\n    background-color: ", ";\n    color: ", ";\n  }\n"])), function (props) {
    return props.theme.months.table.navButton.backgroundColor.base;
}, function (props) {
    return props.theme.months.table.navButton.textColor.base;
}, transition, function (props) {
    return props.theme.months.table.navButton.backgroundColor.hover;
}, function (props) {
    return props.theme.months.table.navButton.textColor.hover;
});
var MonthName = styled.th(templateObject_4$1 || (templateObject_4$1 = __makeTemplateObject(["\n  text-transform: uppercase;\n"], ["\n  text-transform: uppercase;\n"])));
var WeekDays = styled.tr(templateObject_5$1 || (templateObject_5$1 = __makeTemplateObject(["\n  height: ", ";\n  vertical-align: middle;\n"], ["\n  height: ", ";\n  vertical-align: middle;\n"])), function (props) { return props.theme.months.table.weekDays.height; });
var WeekDayName = styled.th(templateObject_6$1 || (templateObject_6$1 = __makeTemplateObject(["\n  font-size: ", ";\n  font-weight: ", ";\n  text-transform: uppercase;\n"], ["\n  font-size: ", ";\n  font-weight: ", ";\n  text-transform: uppercase;\n"])), function (props) { return props.theme.months.table.weekDays.fontSize; }, function (props) { return props.theme.months.table.weekDays.fontSize; });
var templateObject_1$3, templateObject_2$2, templateObject_3$2, templateObject_4$1, templateObject_5$1, templateObject_6$1;

var Month = function (_a) {
    var first = _a.first, date = _a.date, goToNextMonth = _a.goToNextMonth, goToPreviousMonth = _a.goToPreviousMonth, nextMonth = _a.nextMonth, previousMonth = _a.previousMonth;
    var _b = useContext(OptionCtx), locale = _b.locale, endDate = _b.endDate, startDate = _b.startDate, moveBothMonths = _b.moveBothMonths;
    var days = useDays(date);
    var getWeekDayNames = useCallback(function () {
        return Array.from(Array(7).keys()).map(function (day) {
            var _a, _b;
            return (jsx(WeekDayName, { children: (_a = locale.localize) === null || _a === void 0 ? void 0 : _a.day((day + (((_b = locale.options) === null || _b === void 0 ? void 0 : _b.weekStartsOn) || 0)) % 7, {
                    width: 'abbreviated',
                }) }, "day-name-" + day));
        });
    }, [locale]);
    var getMonthName = useCallback(function (date) {
        return date ? "" + format(date, 'LLLL yyyy', { locale: locale }) : '';
    }, [locale]);
    var isMonthOutOfRange = useCallback(function (month) {
        var isSameAsPrevious = undefined === previousMonth || !isSameMonth(previousMonth, month);
        var isSameAsNext = undefined === nextMonth || !isSameMonth(nextMonth, month);
        return ((startDate &&
            new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59) <
                startDate) ||
            (endDate &&
                new Date(month.getFullYear(), month.getMonth(), 1) > endDate) ||
            !isSameAsPrevious ||
            !isSameAsNext);
    }, [startDate, endDate, previousMonth, nextMonth]);
    var showPrevious = moveBothMonths && (undefined !== previousMonth || undefined !== nextMonth)
        ? first && !isMonthOutOfRange(subMonths(date, 1))
        : !isMonthOutOfRange(subMonths(date, 1));
    var showNext = moveBothMonths && (undefined !== previousMonth || undefined !== nextMonth)
        ? !first && !isMonthOutOfRange(addMonths(date, 1))
        : !isMonthOutOfRange(addMonths(date, 1));
    return (jsxs(MonthTable, __assign({ first: first }, { children: [jsxs("thead", { children: [jsxs(Caption, { children: [jsx("th", { children: showPrevious && (jsx(NavButton, __assign({ onClick: goToPreviousMonth }, { children: "<" }), void 0)) }, void 0), jsx(MonthName, __assign({ colSpan: 5 }, { children: getMonthName(date) }), void 0), jsx("th", { children: showNext && jsx(NavButton, __assign({ onClick: goToNextMonth }, { children: ">" }), void 0) }, void 0)] }, void 0), jsx(WeekDays, { children: getWeekDayNames() }, void 0)] }, void 0), jsx("tbody", { children: date &&
                    Array.from(Array(6).keys()).map(function (week) {
                        if (undefined === days[week * 7] ||
                            days[week * 7].type === 'nextMonth') {
                            return null;
                        }
                        return (jsx("tr", { children: Array.from(Array(7).keys()).map(function (weekDay) {
                                var _a;
                                var day = days[week * 7 + (weekDay + (((_a = locale.options) === null || _a === void 0 ? void 0 : _a.weekStartsOn) || 0))];
                                return jsx(Day, __assign({}, day), week + "-" + weekDay);
                            }) }, "week-" + week));
                    }) }, void 0)] }), void 0));
};

var TooltipWrapper = styled.div(templateObject_1$2 || (templateObject_1$2 = __makeTemplateObject(["\n  background-color: ", ";\n  border-radius: ", ";\n  color: ", ";\n  font-size: ", ";\n  margin-top: -5px;\n  padding: ", ";\n  position: absolute;\n  transform: translateY(-100%) translateX(-50%);\n  white-space: nowrap;\n\n  &:after {\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n    border-top: 4px solid\n      ", ";\n    bottom: -4px;\n    content: '';\n    left: 50%;\n    margin-left: -4px;\n    position: absolute;\n  }\n"], ["\n  background-color: ", ";\n  border-radius: ", ";\n  color: ", ";\n  font-size: ", ";\n  margin-top: -5px;\n  padding: ", ";\n  position: absolute;\n  transform: translateY(-100%) translateX(-50%);\n  white-space: nowrap;\n\n  &:after {\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n    border-top: 4px solid\n      ", ";\n    bottom: -4px;\n    content: '';\n    left: 50%;\n    margin-left: -4px;\n    position: absolute;\n  }\n"])), function (props) { return props.theme.tooltip.backgroundColor; }, function (props) { return props.theme.tooltip.borderRadius; }, function (props) { return props.theme.tooltip.textColor; }, function (props) { return props.theme.tooltip.fontSize; }, function (props) { return props.theme.tooltip.padding; }, function (props) { return props.theme.tooltip.backgroundColor; });
var templateObject_1$2;

var Tooltip = function () {
    var _a = useContext(OptionCtx), hoveringTooltipOption = _a.hoveringTooltip, i18n = _a.i18n;
    var _b = useContext(CalendarCtx), start = _b.start, end = _b.end, dayHover = _b.dayHover;
    var hoveringTooltip = useState(hoveringTooltipOption &&
        !((typeof window !== 'undefined' && 'ontouchstart' in window) ||
            typeof navigator === 'undefined' ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0))[0];
    if (!hoveringTooltip || !dayHover || !start || end) {
        return null;
    }
    var nightCount = start && dayHover
        ? Math.abs(differenceInCalendarDays(dayHover.date, start))
        : 0;
    if (nightCount <= 0) {
        return null;
    }
    var top = 0;
    var left = 0;
    if (dayHover.ref.current) {
        var _c = dayHover.ref.current, offsetLeft = _c.offsetLeft, offsetTop = _c.offsetTop, offsetWidth = _c.offsetWidth;
        var parent_1 = dayHover.ref.current.closest('table');
        var _d = parent_1 || {
            offsetLeft: 0,
            offsetTop: 0,
        }, parentLeft = _d.offsetLeft, parentTop = _d.offsetTop;
        top = parentTop + offsetTop;
        left = parentLeft + offsetLeft + offsetWidth / 2;
    }
    return (jsx(TooltipWrapper, __assign({ style: { left: left, top: top } }, { children: typeof hoveringTooltipOption === 'function'
            ? hoveringTooltipOption(nightCount, start, dayHover)
            :
                jsx("div", { dangerouslySetInnerHTML: { __html: (nightCount > 1 ? i18n.night_plural : i18n.night).replace('{{count}}', nightCount.toString()) } }, void 0) }), void 0));
};

var Wrapper$1 = styled.div(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n  align-items: start;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 20px;\n  position: relative;\n"], ["\n  align-items: start;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 20px;\n  position: relative;\n"])));
var Info = styled.div(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["\n  font-size: 11px;\n  text-transform: uppercase;\n"], ["\n  font-size: 11px;\n  text-transform: uppercase;\n"])));
var InfoLabel = styled.span(templateObject_3$1 || (templateObject_3$1 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), function (props) { return props.theme.topBar.textColor; });
var InfoText = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 13px;\n\n  &.start-day,\n  &.end-day {\n    font-weight: bold;\n  }\n"], ["\n  font-size: 13px;\n\n  &.start-day,\n  &.end-day {\n    font-weight: bold;\n  }\n"])));
var Text = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
var CloseButton = styled.button(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  background-color: ", ";\n  border-radius: 4px;\n  border: none;\n  box-shadow: none;\n  cursor: pointer;\n  font-size: 10px;\n  color: ", ";\n  padding: 7px 13px;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: uppercase;\n  ", "\n\n  &:hover {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  @media only screen and ", " {\n    margin-top: 0;\n    position: absolute;\n    right: 0;\n    top: 0;\n  }\n"], ["\n  background-color: ", ";\n  border-radius: 4px;\n  border: none;\n  box-shadow: none;\n  cursor: pointer;\n  font-size: 10px;\n  color: ", ";\n  padding: 7px 13px;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: uppercase;\n  ", "\n\n  &:hover {\n    background-color: ", ";\n    color: ", ";\n  }\n\n  @media only screen and ", " {\n    margin-top: 0;\n    position: absolute;\n    right: 0;\n    top: 0;\n  }\n"])), function (props) {
    return props.theme.topBar.closeButton.backgroundColor.base;
}, function (props) { return props.theme.topBar.closeButton.textColor.base; }, transition, function (props) {
    return props.theme.topBar.closeButton.backgroundColor.hover;
}, function (props) { return props.theme.topBar.closeButton.textColor.hover; }, device.mobileL);
var templateObject_1$1, templateObject_2$1, templateObject_3$1, templateObject_4, templateObject_5, templateObject_6;

var TopBarFeedback = function () {
    var _a = useContext(OptionCtx), minDays = _a.minDays, maxDays = _a.maxDays, i18n = _a.i18n;
    var _b = useContext(CalendarCtx), start = _b.start, end = _b.end;
    if (start && end) {
        return null;
    }
    var text = i18n.infoDefault;
    if (minDays && maxDays) {
        text = i18n.infoRange.replace('{{min}}', (minDays - 1).toString()).replace('{{max}}', (maxDays - 1).toString());
    }
    else if (minDays) {
        var count = minDays - 1;
        text = (count > 1 ? i18n.infoMore_plural : i18n.infoMore).replace('{{count}}', count.toString());
    }
    return jsx("div", { dangerouslySetInnerHTML: { __html: text } }, void 0);
};

var TopBar = function (_a) {
    var handleClose = _a.handleClose;
    var _b = useContext(CalendarCtx), start = _b.start, end = _b.end;
    var _c = useContext(OptionCtx), format$1 = _c.format, locale = _c.locale, i18n = _c.i18n;
    var nightCount = start && end ? differenceInCalendarDays(end, start) : 0;
    return (jsxs(Wrapper$1, { children: [jsxs(Text, { children: [start && (jsxs(Info, { children: [jsxs(InfoLabel, { children: [i18n.selected, "\u00A0"] }, void 0), jsx(InfoText, __assign({ className: "start-day" }, { children: format(start, format$1, { locale: locale }) }), void 0), jsx(InfoText, { children: " - " }, void 0), jsx(InfoText, __assign({ className: "end-day" }, { children: end ? format(end, format$1) : '...' }), void 0), end && (jsxs(InfoText, __assign({ className: "selected-days" }, { children: ["(", jsx("span", { dangerouslySetInnerHTML: { __html: (nightCount > 1 ? i18n.night_plural : i18n.night).replace('{{count}}', nightCount.toString()) } }, void 0), ")"] }), void 0))] }, void 0)), jsx(TopBarFeedback, {}, void 0)] }, void 0), jsx(CloseButton, __assign({ onClick: handleClose }, { children: i18n.button }), void 0)] }, void 0));
};

var Wrapper = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background-color: ", ";\n  border: ", ";\n  border-radius: ", ";\n  box-shadow: ", ";\n  box-sizing: border-box;\n  color: ", ";\n  display: none;\n  font-family: ", ";\n  font-size: ", ";\n  height: auto;\n  left: 0;\n  line-height: ", ";\n  overflow: hidden;\n  position: absolute;\n  transition: transform ", " ease;\n  transform: scaleY(1);\n  transform-origin: 50% 0;\n  width: ", ";\n  z-index: 1;\n\n  @media only screen and ", " {\n    width: ", ";\n  }\n\n  @media only screen and ", " {\n    width: ", ";\n  }\n\n  &.closed {\n    transform: scaleY(0);\n  }\n\n  &.rendered {\n    display: block;\n  }\n"], ["\n  background-color: ", ";\n  border: ", ";\n  border-radius: ", ";\n  box-shadow: ", ";\n  box-sizing: border-box;\n  color: ", ";\n  display: none;\n  font-family: ", ";\n  font-size: ", ";\n  height: auto;\n  left: 0;\n  line-height: ", ";\n  overflow: hidden;\n  position: absolute;\n  transition: transform ", " ease;\n  transform: scaleY(1);\n  transform-origin: 50% 0;\n  width: ", ";\n  z-index: 1;\n\n  @media only screen and ", " {\n    width: ", ";\n  }\n\n  @media only screen and ", " {\n    width: ", ";\n  }\n\n  &.closed {\n    transform: scaleY(0);\n  }\n\n  &.rendered {\n    display: block;\n  }\n"])), function (props) { return props.theme.calendar.backgroundColor; }, function (props) { return props.theme.calendar.border; }, function (props) { return props.theme.calendar.borderRadius; }, function (props) { return props.theme.calendar.boxShadow; }, function (props) { return props.theme.calendar.color; }, function (props) { return props.theme.fontFamily; }, function (props) { return props.theme.calendar.fontSize; }, function (props) { return props.theme.calendar.lineHeight; }, function (props) { return props.theme.animationSpeed; }, function (props) { return props.theme.calendar.widths.sm; }, device.mobileL, function (props) { return props.theme.calendar.widths.md; }, device.tablet, function (props) { return props.theme.calendar.widths.lg; });
var DatePickerInner = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  overflow: hidden;\n  padding: ", ";\n"], ["\n  overflow: hidden;\n  padding: ", ";\n"])), function (props) { return props.theme.calendar.padding; });
var Months = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  @media only screen and ", " {\n    overflow: visible;\n    position: relative;\n\n    &:before {\n      background: ", ";\n      bottom: 0;\n      content: '';\n      display: block;\n      left: 50%;\n      position: absolute;\n      top: 0;\n      width: ", ";\n    }\n    &:after {\n      clear: both;\n      content: '';\n      display: block;\n    }\n  }\n"], ["\n  @media only screen and ", " {\n    overflow: visible;\n    position: relative;\n\n    &:before {\n      background: ", ";\n      bottom: 0;\n      content: '';\n      display: block;\n      left: 50%;\n      position: absolute;\n      top: 0;\n      width: ", ";\n    }\n    &:after {\n      clear: both;\n      content: '';\n      display: block;\n    }\n  }\n"])), device.mobileL, function (props) { return props.theme.months.spacer.color; }, function (props) { return props.theme.months.spacer.width; });
var templateObject_1, templateObject_2, templateObject_3;

var Calendar = function (_a) {
    var handleClose = _a.handleClose, isOpen = _a.isOpen;
    var responsive = useBreakpointsUp(breakpoints);
    var laptop = responsive.laptop;
    var _b = useContext(OptionCtx), showTopBar = _b.showTopBar, startDate = _b.startDate, endDate = _b.endDate, moveBothMonths = _b.moveBothMonths;
    var _c = useContext(CalendarCtx), start = _c.start, end = _c.end;
    var _d = useState(start ? start : startDate ? startDate : new Date()), firstMonth = _d[0], setFirstMonth = _d[1];
    var _e = useState(end ? end : start ? addMonths(start, 1) : addMonths(startDate ? startDate : new Date(), 1)), secondMonth = _e[0], setSecondMonth = _e[1];
    var _f = useState(false), isRender = _f[0], setIsRender = _f[1];
    useEffect(function () {
        var defaultStart = start ? start : new Date();
        var defaultEnd = end ? end : new Date();
        if (startDate && differenceInCalendarMonths(defaultStart, startDate) < 0) {
            defaultStart = new Date(startDate.getTime());
        }
        if (endDate &&
            differenceInCalendarMonths(addMonths(defaultEnd, 1), endDate) > 0) {
            defaultEnd = new Date(subMonths(endDate, 1));
        }
        setFirstMonth(defaultStart);
        setSecondMonth(addMonths(defaultEnd, 1));
    }, [startDate, start, endDate, end]);
    useEffect(function () {
        if (startOfMonth(firstMonth) >= startOfMonth(secondMonth)) {
            setSecondMonth(addMonths(firstMonth, 1));
        }
    }, [firstMonth, secondMonth]);
    useEffect(function () {
        setIsRender(true);
    }, []);
    var classes = clsx({ closed: !isOpen, rendered: isRender });
    return (jsx(React.Fragment, { children: jsx(Wrapper, __assign({ className: classes }, { children: jsxs(DatePickerInner, { children: [showTopBar && jsx(TopBar, { handleClose: handleClose }, void 0), jsxs(Months, { children: [jsx(Month, { first: true, date: firstMonth, nextMonth: laptop ? secondMonth : undefined, goToPreviousMonth: function () {
                                    setFirstMonth(subMonths(firstMonth, 1));
                                    if (moveBothMonths) {
                                        setSecondMonth(subMonths(secondMonth, 1));
                                    }
                                }, goToNextMonth: function () {
                                    setFirstMonth(addMonths(firstMonth, 1));
                                    if (moveBothMonths) {
                                        setSecondMonth(addMonths(secondMonth, 1));
                                    }
                                } }, void 0), jsx(Month, { first: false, date: secondMonth, previousMonth: firstMonth, goToPreviousMonth: function () {
                                    setSecondMonth(subMonths(secondMonth, 1));
                                    if (moveBothMonths) {
                                        setFirstMonth(subMonths(firstMonth, 1));
                                    }
                                }, goToNextMonth: function () {
                                    setSecondMonth(addMonths(secondMonth, 1));
                                    if (moveBothMonths) {
                                        setFirstMonth(addMonths(firstMonth, 1));
                                    }
                                } }, void 0), jsx(Tooltip, {}, void 0)] }, void 0)] }, void 0) }), void 0) }, void 0));
};

var DefaultInput = function (_a) {
    var value = _a.value, onClick = _a.onClick;
    return jsx("input", { value: value, onClick: onClick, readOnly: true }, void 0);
};
// noinspection JSIgnoredPromiseFromCall
var HotelDatepicker = forwardRef(function (props, ref) {
    var defaults = __assign(__assign({}, defaultOptions), { minNights: 1, maxNights: 0, onOpenDatepicker: undefined, disabledDatesBetweenChecks: true, theme: theme, i18n: enTranslations, inputElement: DefaultInput });
    var propsWithDefault = _.defaultsDeep(__assign({}, props), defaults);
    var inputElement = propsWithDefault.inputElement, onOpenDatepicker = propsWithDefault.onOpenDatepicker, minNights = propsWithDefault.minNights, maxNights = propsWithDefault.maxNights, theme$1 = propsWithDefault.theme, defaultValue = propsWithDefault.defaultValue, disabledDatesBetweenChecks = propsWithDefault.disabledDatesBetweenChecks, disabledDates = propsWithDefault.disabledDates, locale = propsWithDefault.locale, contextProps = __rest(propsWithDefault, ["inputElement", "onOpenDatepicker", "minNights", "maxNights", "theme", "defaultValue", "disabledDatesBetweenChecks", "disabledDates", "locale"]);
    var _a = useState((defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.start) || false), start = _a[0], setStart = _a[1];
    var _b = useState((defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue.end) || false), end = _b[0], setEnd = _b[1];
    var _c = useState(false), dayHover = _c[0], setDayHover = _c[1];
    var _d = useState(false), isOpen = _d[0], setIsOpen = _d[1];
    var minDays = minNights > 1 ? minNights + 1 : 2;
    var maxDays = maxNights > 0 ? maxNights + 1 : 0;
    if (disabledDatesBetweenChecks) {
        contextProps.noCheckInDates
            .sort(function (a, b) { return a.getTime() - b.getTime(); })
            .forEach(function (checkIn) {
            var nextCheckout = closestTo(checkIn, contextProps.noCheckOutDates.filter(function (date) {
                return isAfter(date, checkIn);
            }));
            if (nextCheckout && differenceInDays(nextCheckout, checkIn) > 1) {
                disabledDates.push.apply(disabledDates, eachDayOfInterval({
                    start: addDays(checkIn, 1),
                    end: subDays(nextCheckout, 1),
                }));
            }
        });
    }
    var optionContext = __assign(__assign({}, contextProps), { disabledDates: disabledDates.sort(function (a, b) { return a.getTime() - b.getTime(); }), minDays: minDays, maxDays: maxDays, locale: locale });
    var preventContainerClose = optionContext.preventContainerClose, format$1 = optionContext.format, showTopBar = optionContext.showTopBar, onSelectRange = optionContext.onSelectRange;
    var calendarContext = {
        start: start,
        end: end,
        dayHover: dayHover,
        setStart: function (value) { return setStart(value); },
        setEnd: function (value) {
            setEnd(value);
            if (start && value && contextProps.autoClose) {
                setIsOpen(false);
            }
        },
        setDayHover: function (value) { return setDayHover(value); },
    };
    var wrapperRef = useRef(null);
    useOutsideListener(wrapperRef, function () { return setIsOpen(false); }, preventContainerClose && showTopBar);
    var mergedTheme = _.defaultsDeep(theme$1, theme);
    useImperativeHandle(ref, function () {
        return {
            clear: function () {
                setStart(false);
                setEnd(false);
                setDayHover(false);
                onSelectRange && onSelectRange(false, false);
            },
        };
    }, [onSelectRange]);
    var handleInputClick = useCallback(function () {
        setIsOpen(true);
        onOpenDatepicker && onOpenDatepicker();
    }, [onOpenDatepicker]);
    var Input = inputElement;
    return (jsx(ThemeProvider, __assign({ theme: mergedTheme }, { children: jsx(OptionCtx.Provider, __assign({ value: optionContext }, { children: jsx(CalendarCtx.Provider, __assign({ value: calendarContext }, { children: jsxs(Wrapper$2, __assign({ ref: wrapperRef }, { children: [jsx(Input, { onClick: handleInputClick, value: start && end
                                ? format(start, format$1, {
                                    locale: locale,
                                }) + " - " + format(end, format$1, {
                                    locale: locale,
                                })
                                : '' }, void 0), jsx(Calendar, { handleClose: function () { return setIsOpen(false); }, isOpen: isOpen }, void 0)] }), void 0) }), void 0) }), void 0) }), void 0));
});

export { HotelDatepicker };
//# sourceMappingURL=index.es.js.map
