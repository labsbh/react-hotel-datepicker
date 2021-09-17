import { lazy } from 'react';

export const LazyHotelDatePicker = lazy( () => {
    return new Promise((resolve => {
        setTimeout( () => resolve(import('./HotelDatepicker').then()), 3000 );
    }))
    // return import('./HotelDatepicker');
});