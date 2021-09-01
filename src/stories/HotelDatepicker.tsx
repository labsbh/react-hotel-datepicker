import {
    addDays,
    closestTo,
    differenceInDays,
    eachDayOfInterval,
    format as dateFormat,
    isAfter,
    subDays,
} from 'date-fns';
import _ from 'lodash';
import * as React from 'react';
import { forwardRef, ReactElement, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import Calendar from '../Calendar';
import { useOutsideListener } from '../hooks';
import { CalendarCtx, defaultOptions, OptionCtx } from '../Store';
import { enTranslations as en, i18nConfig } from '../translations';
import {
    CalendarContext,
    DayHover,
    HotelDatepickerProps,
    HotelDatepickerRef,
    InputElementProps,
    OptionContext,
} from '../typings';
import { theme as defaultTheme, Wrapper } from './styled';

const DefaultInput = ({ value, onClick }: InputElementProps): ReactElement =>
    <input value={value} onClick={onClick} readOnly />;

// noinspection JSIgnoredPromiseFromCall
const HotelDatepicker = forwardRef<HotelDatepickerRef, Partial<HotelDatepickerProps>>(
    (props: Partial<HotelDatepickerProps>, ref): ReactElement => {
        const defaults: HotelDatepickerProps = {
            ...defaultOptions,
            minNights: 1,
            maxNights: 0,
            onOpenDatepicker: undefined,
            disabledDatesBetweenChecks: true,
            theme: defaultTheme,
            i18n: en,
            inputElement: DefaultInput,
        };
        const propsWithDefault: HotelDatepickerProps = _.defaultsDeep({ ...props }, defaults);
        const {
            inputElement,
            onOpenDatepicker,
            minNights,
            maxNights,
            theme,
            defaultValue,
            disabledDatesBetweenChecks,
            disabledDates,
            i18n,
            locale,
            ...contextProps
        } = propsWithDefault;
        const [start, setStart] = useState<Date | false>(
            defaultValue?.start || false,
        );
        const [end, setEnd] = useState<Date | false>(defaultValue?.end || false);
        const [dayHover, setDayHover] = useState<DayHover | false>(false);
        const [isOpen, setIsOpen] = useState(false);

        const minDays = minNights > 1 ? minNights + 1 : 2;
        const maxDays = maxNights > 0 ? maxNights + 1 : 0;

        if (disabledDatesBetweenChecks) {
            contextProps.noCheckInDates
                .sort((a: Date, b: Date) => a.getTime() - b.getTime())
                .forEach((checkIn: Date) => {
                    const nextCheckout = closestTo(
                        checkIn,
                        contextProps.noCheckOutDates.filter((date: Date) =>
                            isAfter(date, checkIn),
                        ),
                    );
                    if (nextCheckout && differenceInDays(nextCheckout, checkIn) > 1) {
                        disabledDates.push(
                            ...eachDayOfInterval({
                                start: addDays(checkIn, 1),
                                end: subDays(nextCheckout, 1),
                            }),
                        );
                    }
                });
        }

        const optionContext: OptionContext = {
            ...contextProps,
            disabledDates: disabledDates.sort((a: Date, b: Date) => a.getTime() - b.getTime()),
            minDays,
            maxDays,
            locale,
        };

        const localeCode = locale.code || 'en';

        const { preventContainerClose, format, showTopBar, onSelectRange } = optionContext;

        const calendarContext: CalendarContext = {
            start,
            end,
            dayHover,
            setStart: (value: Date | false): void => setStart(value),
            setEnd: (value: Date | false): void => {
                setEnd(value);
                if (start && value && contextProps.autoClose) {
                    setIsOpen(false);
                }
            },
            setDayHover: (value: DayHover | false): void => setDayHover(value),
        };

        const wrapperRef = useRef<HTMLDivElement>(null);
        useOutsideListener(
            wrapperRef,
            () => setIsOpen(false),
            preventContainerClose && showTopBar,
        );

        const mergedTheme: DefaultTheme = _.defaultsDeep(theme, defaultTheme);

        useImperativeHandle(
            ref,
            () => {
                return {
                    clear: (): void => {
                        setStart(false);
                        setEnd(false);
                        setDayHover(false);
                        onSelectRange && onSelectRange(false, false);
                    },
                };
            },
            [],
        );

        useEffect(() => {
            i18nConfig.languages = [localeCode];
            i18nConfig.addResourceBundle(localeCode, 'hoteldatepicker', i18n);
            // noinspection JSIgnoredPromiseFromCall
            i18nConfig.changeLanguage(localeCode);
        }, [localeCode, i18n]);

        const handleInputClick = useCallback(() => {
            setIsOpen(true);
            onOpenDatepicker && onOpenDatepicker();
        }, [onOpenDatepicker]);

        let Input = inputElement;

        return (
            <I18nextProvider i18n={i18nConfig} defaultNS="hoteldatepicker">
                <ThemeProvider theme={mergedTheme}>
                    <OptionCtx.Provider value={optionContext}>
                        <CalendarCtx.Provider value={calendarContext}>
                            <Wrapper ref={wrapperRef}>
                                <Input onClick={handleInputClick} value={start && end
                                    ? `${dateFormat(start, format, {
                                        locale: locale,
                                    })} - ${dateFormat(end, format, {
                                        locale: locale,
                                    })}`
                                    : ''} />
                                <Calendar
                                    handleClose={() => setIsOpen(false)}
                                    isOpen={isOpen}
                                />
                            </Wrapper>
                        </CalendarCtx.Provider>
                    </OptionCtx.Provider>
                </ThemeProvider>
            </I18nextProvider>
        );
    },
);

export default HotelDatepicker;
