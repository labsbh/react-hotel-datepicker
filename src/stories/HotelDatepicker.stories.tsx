import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {frTranslations} from '../translations';

import HotelDatepicker from './HotelDatepicker';

export default {
    title: 'Example/HotelDatepicker',
    component: HotelDatepicker,
    argTypes: {
    },
} as ComponentMeta<typeof HotelDatepicker>;

const Template: ComponentStory<typeof HotelDatepicker> = (args) => <HotelDatepicker {...args} />;

export const Default = Template.bind({});
Default.args = {
    i18n: frTranslations,
};
