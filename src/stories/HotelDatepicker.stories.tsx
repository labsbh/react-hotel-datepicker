import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18nConfig from './i18n';

import HotelDatepicker from './HotelDatepicker';

export default {
    title: 'Example/HotelDatepicker',
    component: HotelDatepicker,
    argTypes: {
    },
} as ComponentMeta<typeof HotelDatepicker>;

const Template: ComponentStory<typeof HotelDatepicker> = (args) => <I18nextProvider i18n={i18nConfig} defaultNS="hoteldatepicker"><HotelDatepicker {...args} /></I18nextProvider>;

export const Default = Template.bind({});
Default.args = {};
