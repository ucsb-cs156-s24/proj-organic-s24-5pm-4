import { render, fireEvent, screen } from "@testing-library/react";
import {FormProvider, useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import UserDropdown from "../../../main/components/Users/UserDropdown";
import React from "react";
import usersFixtures from "../../../fixtures/usersFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const ModelForm = ({users}) =>{
    const formState = useForm({defaultValues: {},});
    const {
        handleSubmit
    } = formState;

    const onSubmit = () => {
        /*
        This is here so the form doesn't get angry about not having a submit,
        as we want to test the dropdown, not the mocked form
         */
    }

    return(
        <FormProvider {...formState}>
            <Form onSubmit={handleSubmit(onSubmit)}>
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



describe("Tests as a standalone user dropdown", () =>{

    test("Works without users passed in", async () => {
        render(
            <ModelForm />
        )

        await screen.findByText(/User/);

        expect(screen.getByTestId("UserDropdownExample-users")).toBeInTheDocument();

        const user1 = screen.queryByTestId("UserDropdownExample-option-0");

        expect(user1).not.toBeInTheDocument();
    })
    test("Won't let you submit blank", async () => {
        render(
            <ModelForm />
        )
        await screen.findByText(/User/);

        expect(screen.getByTestId("UserDropdownExample-users")).toBeInTheDocument();

        const submit = screen.getByTestId(/UserDropdownExample-submit/);
        fireEvent.click(submit);

        await screen.findByText(/User is required/);
    })

    test("Renders 3 users correctly", async () => {
        render(
            <ModelForm users={usersFixtures.threeUsers}/>
        )

        await screen.findByText(/User/);

        const user1 = screen.getByTestId("UserDropdownExample-option-0");
        const user2 = screen.getByTestId("UserDropdownExample-option-1");
        const user3 = screen.getByTestId("UserDropdownExample-option-2");

        expect(screen.getByTestId("UserDropdownExample-users")).toBeInTheDocument();

        expect(user1).toHaveTextContent("Phill Conrad");
        expect(user2).toHaveTextContent("Chris Gaucho");
        expect(user3).toHaveTextContent("Lauren del Playa");
    })

    test("Validation work correctly", async () => {
        render(
            <ModelForm users={usersFixtures.threeUsers}/>
        )

        await screen.findByText(/User/);

        expect(screen.getByTestId("UserDropdownExample-users")).toBeInTheDocument();

        const submit = screen.getByTestId(/UserDropdownExample-submit/);
        fireEvent.click(submit);

        await screen.findByText(/User is required/);
    })
})