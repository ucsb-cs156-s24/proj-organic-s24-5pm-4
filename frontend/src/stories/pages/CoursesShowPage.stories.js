import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesFixtures } from "fixtures/coursesFixtures";
import { rest } from "msw";

import CoursesShowPage from "main/pages/CoursesShowPage";
import {studentsFixtures} from "../../fixtures/studentsFixtures";

export default {
    title: 'pages/Courses/CoursesShowPage',
    component: CoursesShowPage
};

const Template = () => <CoursesShowPage/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/courses/get', (_req, res, ctx) => {
            return res(ctx.json(coursesFixtures.threeCourses[0]));
        }),
        rest.post('/api/students/upload/egrades', (req, res, ctx) => {
            window.alert("POST: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
        rest.get('/api/students/all', (_req, res, ctx) => {
            return res(ctx.json(studentsFixtures.threeStudent));
        }),
    ],
}