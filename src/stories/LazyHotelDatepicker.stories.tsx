import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { Suspense } from 'react';
import { LazyHotelDatePicker } from './LazyHotelDatePicker';

const LazyLoaded= (props:any) => {
    return <Suspense fallback={<div>Loading</div>}><LazyHotelDatePicker {...props} /></Suspense>;
};

export default {
    title: 'Example/LazyHotelDatepicker',
    component: LazyLoaded,
    argTypes: {
    },
} as ComponentMeta<typeof LazyLoaded>;

const Template: ComponentStory<typeof LazyLoaded> = (args) => <LazyLoaded {...args}/>


export const Default = Template.bind({});
Default.args = {};