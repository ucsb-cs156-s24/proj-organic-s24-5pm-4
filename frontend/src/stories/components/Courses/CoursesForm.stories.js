import React from 'react';
import CoursesForm from 'main/components/Courses/CoursesForm';
import { coursesFixtures } from 'fixtures/coursesFixtures';
import {rest} from "msw";
import {schoolsFixtures} from "../../../fixtures/schoolsFixtures";

export default {
    title: 'components/Courses/CoursesForm',
    component: CoursesForm
};


const Template = (args) => {
    return (
        <CoursesForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

Create.parameters ={
    msw:[
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools));
        })
    ]
}

export const Update = Template.bind({});

Update.args = {
    initialContents: coursesFixtures.oneCourse,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

Update.parameters ={
    msw:[
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools));
        })
    ]
}