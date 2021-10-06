import { Locale } from 'date-fns';
import * as React from 'react';
import { ComponentType, ReactElement } from 'react';

declare const en: {
    selected: string;
    night: string;
    night_plural: string;
    button: string;
    infoMore: string;
    infoMore_plural: string;
    infoRange: string;
    infoDefault: string;
};

interface HotelDatePickerTheme {
    fontFamily?: string;
    animationSpeed?: string;
    calendar?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        boxShadow?: string;
        color?: string;
        fontSize?: string;
        lineHeight?: string;
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
declare type DayMonthType = 'lastMonth' | 'visibleMonth' | 'nextMonth';
declare type TooltipCallback = (nights: number, start: Date, hover: MonthDayInfos) => string | ReactElement;
declare type DayOfMonth = {
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
declare type MonthDayInfos = DayOfMonth;
declare type HotelDatepickerRef = {
    clear: () => void;
};
declare type Translations = typeof en;
interface InputElementProps {
    value?: string;
    onClick?: () => any;
}
declare type HotelDatepickerProps = {
    locale: Locale;
    format: string;
    startDate: Date | false;
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
    defaultValue?: {
        start: Date | null;
        end: Date | null;
    };
    disabledDatesBetweenChecks: boolean;
};

declare const HotelDatepicker: React.ForwardRefExoticComponent<Partial<HotelDatepickerProps> & React.RefAttributes<HotelDatepickerRef>>;

export { HotelDatePickerTheme, HotelDatepicker, HotelDatepickerProps, HotelDatepickerRef, InputElementProps, Translations };
