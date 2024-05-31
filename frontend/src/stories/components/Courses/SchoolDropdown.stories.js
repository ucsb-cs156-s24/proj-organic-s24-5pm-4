import React from 'react';
import SchoolDropdown from "../../../main/components/Courses/SchoolDropdown";
import {schoolsFixtures} from "../../../fixtures/schoolsFixtures";
import {Button, Form} from "react-bootstrap";
import {FormProvider, useForm} from "react-hook-form";

export default {
    title: "components/Courses/SchoolDropdown",
    component: SchoolDropdown
}

const Template = (args) => {
    return(
        <ModelForm {...args} />
    );
}

export const Filled = Template.bind({});

Filled.args={
    schools: schoolsFixtures.threeSchools,
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}

export const Preselected = Template.bind({});

Preselected.args={
    schools: schoolsFixtures.threeSchools,
    initialContents: {"school":"UC Santa Barbara"},
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}


const ModelForm = ({initialContents, submitAction, schools}) =>{
    const formState = useForm({defaultValues: initialContents || {},});
    const {
        handleSubmit
    } = formState;
    return(
        <FormProvider {...formState}>
            <Form onSubmit={handleSubmit(submitAction)}>
                <SchoolDropdown schools={schools} testId="SchoolDropdownExample" />
                <Button
                    type="submit"
                    data-testid="SchoolDropdownExample-submit"
                >
                    Submit
                </Button>
            </Form>
        </FormProvider>
    )
}

