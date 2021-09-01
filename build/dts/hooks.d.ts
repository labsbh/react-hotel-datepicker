import { RefObject } from 'react';
import { BreakPoints } from './typings';
declare const useOutsideListener: (ref: RefObject<any>, onClickOutside: () => void, preventContainerClose: boolean) => void;
declare const useCurrentWidth: () => number;
declare const useBreakpoints: (breakpoints: BreakPoints) => Record<string, boolean>;
declare const useBreakpointsUp: (breakpoints: BreakPoints) => Record<string, boolean>;
declare const useBreakpointsDown: (breakpoints: BreakPoints) => Record<string, boolean>;
export { useOutsideListener, useCurrentWidth, useBreakpoints, useBreakpointsUp, useBreakpointsDown, };
