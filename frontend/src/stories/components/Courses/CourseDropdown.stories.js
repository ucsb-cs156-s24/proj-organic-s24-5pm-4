import React from 'react';
import CourseDropdown from "../../../main/components/Courses/CourseDropdown";
import {coursesFixtures} from "../../../fixtures/coursesFixtures";
import {Button, Form} from "react-bootstrap";
import {FormProvider, useForm} from "react-hook-form";

export default {
    title: "components/Courses/CourseDropdown",
    component: CourseDropdown
}

const Template = (args) => {
    return(
        <ModelForm {...args} />
    );
}

export const Filled = Template.bind({});

Filled.args={
    courses: coursesFixtures.threeCourses,
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}

export const Preselected = Template.bind({});

Preselected.args={
    courses: coursesFixtures.threeCourses,
    initialContents: {"course":1 },
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}


const ModelForm = ({initialContents, submitAction, courses}) =>{
    const formState = useForm({defaultValues: initialContents || {},});
    const {
        handleSubmit
    } = formState;
    return(
        <FormProvider {...formState}>
            <Form onSubmit={handleSubmit(submitAction)}>
                <CourseDropdown courses={courses} testId="CourseDropdownExample" />
                <Button
                    type="submit"
                    data-testid="CourseDropdownExample-submit"
                >
                    Submit
                </Button>
            </Form>
        </FormProvider>
    )
}