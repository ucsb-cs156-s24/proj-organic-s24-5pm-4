import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesFixtures } from "fixtures/coursesFixtures";
import { rest } from "msw";

import CourseIndexPage from "main/pages/CourseIndexPage";
import {schoolsFixtures} from "../../fixtures/schoolsFixtures";

export default {
    title: 'pages/Course/CourseIndexPage',
    component: CourseIndexPage
};

const Template = () => <CourseIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json(coursesFixtures.threeCourses));
        }),
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),

    ]
}

export const ThreeItemsInstructorUser = Template.bind({});

ThreeItemsInstructorUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.instructorUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json(coursesFixtures.threeCourses));
        }),
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/schools/all', (_req, res, ctx) => {
            return res(ctx.json(schoolsFixtures.threeSchools));
        }),
        rest.get('/api/courses/all', (_req, res, ctx) => {
            return res(ctx.json(coursesFixtures.threeCourses));
        }),
        rest.delete('/api/courses', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}