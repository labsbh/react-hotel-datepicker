import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import HotelDatepicker from './HotelDatepicker';

export default {
    title: 'Example/HotelDatepicker',
    component: HotelDatepicker,
    argTypes: {
    },
} as ComponentMeta<typeof HotelDatepicker>;

const Template: ComponentStory<typeof HotelDatepicker> = (args) => <HotelDatepicker {...args} />;

export const Default = Template.bind({});
Default.args = {};
