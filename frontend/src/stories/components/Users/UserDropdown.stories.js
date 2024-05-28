import React from 'react';
import UserDropdown from "../../../main/components/Users/UserDropdown";
// import {schoolsFixtures} from "../../../fixtures/schoolsFixtures";
import {usersFixtures} from "../../../fixtures/usersFixtures";
import {Button, Form} from "react-bootstrap";
import {FormProvider, useForm} from "react-hook-form";

export default {
    title: "components/Users/UserDropdown",
    component: UserDropdown
}

const Template = (args) => {
    return(
        <ModelForm {...args} />
    );
}

export const Filled = Template.bind({});

Filled.args={
    users: usersFixtures.threeUsers,
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}

export const Preselected = Template.bind({});

Preselected.args={
    users: usersFixtures.threeUsers,
    initialContents: {"user":11111 },
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}


const ModelForm = ({initialContents, submitAction, users}) =>{
    const formState = useForm({defaultValues: initialContents || {},});
    const {
        handleSubmit
    } = formState;
    return(
        <FormProvider {...formState}>
            <Form onSubmit={handleSubmit(submitAction)}>
                <UserDropdown users={users} testId="UserDropdownExample" />
                <Button
                    type="submit"
                    data-testid="UserDropdownExample-submit"
                >
                    Submit
                </Button>
            </Form>
        </FormProvider>
    )
}