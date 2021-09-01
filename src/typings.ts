import { Locale } from 'date-fns';
import { ComponentType, ReactElement, RefObject } from 'react';
import { enTranslations as translations } from './translations';

type DeepRequired<T> = {
    [K in keyof T]: Required<DeepRequired<T[K]>>;
};

export interface HotelDatePickerTheme {
    fontFamily?: string;
    animationSpeed?: string;
    calendar?: {
        backgroundColor?: string;
        borderRadius?: string;
        boxShadow?: string;
        color?: string;
        fontSize?: string;
        lineHeight: string;
        padding?: string;
        widths?: {
            sm?: string;
            md?: string;
            lg?: string;
        };
    };
    months?: {
        spacer?: {
            color?: string;
            width?: string;
        };
        table?: {
            fontSize?: string;
            borderColor?: string;
            caption?: {
                height?: string;
            };
            navButton?: {
                backgroundColor?: {
                    base?: string;
                    hover?: string;
                };
                textColor?: {
                    base?: string;
                    hover?: string;
                };
            };
            weekDays?: {
                height?: string;
                fontSize?: string;
                fontWeight?: string;
            };
            widths?: {
                sm?: string;
                md?: string;
                lg?: string;
            };
        };
    };
    days?: {
        textColor?: string;
        padding?: string;
        selected?: {
            backgroundColor?: {
                base?: string;
                hover?: string;
            };
            textColor?: string;
        };
        noCheckIn?: {
            backgroundColor?: string;
            textColor?: string;
        };
        noCheckOut?: {
            backgroundColor?: string;
            textColor?: string;
        };
        invalid?: {
            backgroundColor?: string;
            textColor?: string;
        };
        disabled?: {
            backgroundColor?: string;
            crossColor?: string;
            textColor?: string;
        };
        dowDisabled?: {
            backgroundColor?: string;
            textColor?: string;
        };
        today?: {
            backgroundColor?: string;
            textColor?: string;
        };
    };
    tooltip?: {
        backgroundColor?: string;
        textColor?: string;
        borderRadius?: string;
        fontSize?: string;
        padding?: string;
    };
    topBar?: {
        backgroundColor?: string;
        textColor?: string;
        closeButton?: {
            backgroundColor?: {
                base?: string;
                hover?: string;
            };
            textColor?: {
                base?: string;
                hover?: string;
            };
        };
    };
}

export type BreakPoint = {
    min: number;
    max: number | null;
};

export type BreakPoints = Record<string, BreakPoint>;

export type DayMonthType = 'lastMonth' | 'visibleMonth' | 'nextMonth';

export type TooltipCallback = (
    nights: number,
    start: Date,
    hover: Date,
) => string | ReactElement;

export type DayOfMonth = {
    date: Date;
    title: string;
    type: DayMonthType;
    isValid: boolean;
    isToday: boolean;
    isStartDate: boolean;
    isDayBeforeDisabledDate: boolean;
    isDisabled: boolean;
    isFirstEnabledDate: boolean;
    isDayOfWeekDisabled: boolean;
    isFirstDisabledDate: boolean;
    isNoCheckIn: boolean;
    isNoCheckOut: boolean;
};

export type DayHover = MonthDayInfos & {
    ref: RefObject<HTMLTableCellElement>;
};

export type DayClickCallback = (
    _day: Day,
    _isNoCheckIn: boolean,
    _isNoCheckOut: boolean,
) => any;

export type DayHoverCallback = (_day: Day, _left: number, _top: number) => any;

export type OptionContext = {
    locale: Locale;
    format: string;
    startDate: Date;
    endDate: Date | false;
    minDays: number;
    maxDays: number;
    selectForward: boolean;
    disabledDates: Array<Date>;
    noCheckInDates: Array<Date>;
    noCheckOutDates: Array<Date>;
    disabledDaysOfWeek: Array<number>;
    enableCheckout: boolean;
    preventContainerClose: boolean;
    hoveringTooltip: boolean | TooltipCallback;
    autoClose: boolean;
    showTopBar: boolean;
    moveBothMonths: boolean;
    onDayClick: undefined | false | ((date: Date) => any);
    onSelectRange: undefined | false | ((start: Date | false, end: Date | false) => any);
};

export type CalendarContext = {
    start: Date | false;
    end: Date | false;
    dayHover: DayHover | false;
    setStart: (_value: Date | false) => void;
    setEnd: (_value: Date | false) => void;
    setDayHover: (_value: DayHover | false) => void;
};

export type MonthDayInfos = DayOfMonth;

export type HotelDatepickerRef = {
    clear: () => void;
};

export type Translations = typeof translations;

export interface InputElementProps {
    value?: string,
    onClick?: () => any,
}

export type HotelDatepickerProps = {
    locale: Locale;
    format: string;
    startDate: Date;
    endDate: Date | false;
    minNights: number;
    maxNights: number;
    selectForward: boolean;
    disabledDates: Array<Date>;
    noCheckInDates: Array<Date>;
    noCheckOutDates: Array<Date>;
    disabledDaysOfWeek: Array<number>;
    enableCheckout: boolean;
    preventContainerClose: boolean;
    hoveringTooltip: boolean | TooltipCallback;
    autoClose: boolean;
    showTopBar: boolean;
    moveBothMonths: boolean;
    i18n: Translations;
    onDayClick: undefined | false | ((_date: Date) => any);
    onOpenDatepicker: undefined | false | (() => any);
    onSelectRange: undefined | false | ((_start: Date | false, _end: Date | false) => any);
    inputElement: ComponentType<InputElementProps>;
    theme: HotelDatePickerTheme;
    defaultValue?: { start: Date | null; end: Date | null };
    disabledDatesBetweenChecks: boolean;
};

export type CalendarProps = {
    handleClose: () => any;
    isOpen: boolean;
};

export type MonthProps = {
    first: boolean;
    date: Date;
    goToNextMonth: () => any;
    goToPreviousMonth: () => any;
    previousMonth?: Date;
    nextMonth?: Date;
};

export type DayProps = MonthDayInfos;

export type TopBarProps = {
    handleClose: () => any;
};
