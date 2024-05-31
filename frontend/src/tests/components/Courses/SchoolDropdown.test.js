import { render, fireEvent, screen } from "@testing-library/react";
import {FormProvider, useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import SchoolDropdown from "../../../main/components/Courses/SchoolDropdown";
import React from "react";
import {schoolsFixtures} from "../../../fixtures/schoolsFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const ModelForm = ({schools}) =>{
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



describe("Tests as a standalone school dropdown", () =>{

    test("Works without schools passed in", async () => {
        render(
            <ModelForm />
        )

        await screen.findByText(/School/);

        expect(screen.getByTestId("SchoolDropdownExample-school")).toBeInTheDocument();

        const school1 = screen.queryByTestId("SchoolDropdownExample-option-0");

        expect(school1).not.toBeInTheDocument();
    })
    test("Won't let you submit blank", async () => {
        render(
            <ModelForm />
        )
        await screen.findByText(/School/);

        expect(screen.getByTestId("SchoolDropdownExample-school")).toBeInTheDocument();

        const submit = screen.getByTestId(/SchoolDropdownExample-submit/);
        fireEvent.click(submit);

        await screen.findByText(/School is required/);
    })

    test("Renders 3 schools correctly", async () => {
        render(
            <ModelForm schools={schoolsFixtures.threeSchools}/>
        )

        await screen.findByText(/School/);

        const school1 = screen.getByTestId("SchoolDropdownExample-option-0");
        const school2 = screen.getByTestId("SchoolDropdownExample-option-1");
        const school3 = screen.getByTestId("SchoolDropdownExample-option-2");

        expect(screen.getByTestId("SchoolDropdownExample-school")).toBeInTheDocument();

        expect(school1).toHaveTextContent("UC Santa Barbara");
        expect(school2).toHaveTextContent("University of Minnesota");
        expect(school3).toHaveTextContent("UC San Diego");
    })

    test("Validation work correctly", async () => {
        render(
            <ModelForm schools={schoolsFixtures.threeSchools}/>
        )

        await screen.findByText(/School/);

        expect(screen.getByTestId("SchoolDropdownExample-school")).toBeInTheDocument();

        const submit = screen.getByTestId(/SchoolDropdownExample-submit/);
        fireEvent.click(submit);

        await screen.findByText(/School is required/);
    })
})