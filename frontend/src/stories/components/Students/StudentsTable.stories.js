import React from 'react';
import { studentsFixtures } from 'fixtures/studentsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";
import StudentsTable from "../../../main/components/Students/StudentsTable";

export default {
    title: 'components/Students/StudentsTable',
    component: StudentsTable
};

const Template = (args) => {
    return (
        <StudentsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    student: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    student: studentsFixtures.threeStudents,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    student: studentsFixtures.threeStudents,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/course/student/all', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};