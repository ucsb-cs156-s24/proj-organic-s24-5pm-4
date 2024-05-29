
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { staffFixture } from "fixtures/staffFixture";
import { rest } from "msw";

import StaffEditPage from "main/pages/StaffEditPage";

export default {
    title: 'pages/Staff/StaffEditPage',
    component: StaffEditPage
};

const Template = () => <StaffEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/helprequest', (_req, res, ctx) => {
            return res(ctx.json(staffFixture.threeStaff[0]));
        }),
        rest.put('/api/helprequest', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}