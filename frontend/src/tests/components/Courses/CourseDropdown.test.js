import { render, fireEvent, screen } from "@testing-library/react";
import {FormProvider, useForm} from "react-hook-form";
import {Button, Form} from "react-bootstrap";
import CourseDropdown from "../../../main/components/Courses/CourseDropdown";
import React from "react";
import {coursesFixtures} from "../../../fixtures/coursesFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const ModelForm = ({courses}) =>{
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



describe("Tests as a standalone course dropdown", () =>{

    test("Works without courses passed in", async () => {
        render(
            <ModelForm />
        )

        await screen.findByText(/Course/);

        expect(screen.getByTestId("CourseDropdownExample-courses")).toBeInTheDocument();

        const course1 = screen.queryByTestId("CourseDropdownExample-option-0");

        expect(course1).not.toBeInTheDocument();
    })
    test("Won't let you submit blank", async () => {
        render(
            <ModelForm />
        )
        await screen.findByText(/Course/);

        expect(screen.getByTestId("CourseDropdownExample-courses")).toBeInTheDocument();

        const submit = screen.getByTestId(/CourseDropdownExample-submit/);
        fireEvent.click(submit);

        await screen.findByText(/Course is required/);
    })

    test("Renders 3 courses correctly", async () => {
        render(
            <ModelForm courses={coursesFixtures.threeCourses}/>
        )

        await screen.findByText(/Course/);

        const course1 = screen.getByTestId("CourseDropdownExample-option-0");
        const course2 = screen.getByTestId("CourseDropdownExample-option-1");
        const course3 = screen.getByTestId("CourseDropdownExample-option-2");

        expect(screen.getByTestId("CourseDropdownExample-courses")).toBeInTheDocument();

        expect(course1).toHaveTextContent("CS156");
        expect(course2).toHaveTextContent("CS185");
        expect(course3).toHaveTextContent("CS170");
    })

    test("Validation work correctly", async () => {
        render(
            <ModelForm courses={coursesFixtures.threeCourses}/>
        )

        await screen.findByText(/Course/);

        expect(screen.getByTestId("CourseDropdownExample-courses")).toBeInTheDocument();

        const submit = screen.getByTestId(/CourseDropdownExample-submit/);
        fireEvent.click(submit);

        await screen.findByText(/Course is required/);
    })
})