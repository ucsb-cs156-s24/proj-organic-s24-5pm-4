import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import AddCourseStaffForm from "main/components/Courses/AddCourseStaffForm";
import { addCourseStaffFixtures } from "fixtures/addCourseStaffFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import {usersFixtures} from "../../../fixtures/usersFixtures";
import {QueryClient, QueryClientProvider} from "react-query"; // Import the function to test

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const axiosMock = new AxiosMockAdapter(axios);

const setupUsers = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/admin/users").reply(200, usersFixtures.threeUsers);
}


describe("AddCourseStaffForm tests", () => {
    beforeEach(() => {
        setupUsers();
    })
    const queryClient = new QueryClient();

    test("renders correctly", async () => {

        render(
            <QueryClientProvider client={queryClient}>
            <Router  >
                <AddCourseStaffForm />
            </Router>
            </QueryClientProvider>
        );
        await screen.findByText(/User/);
        await screen.findByText(/Create/);
    });


    // test("renders correctly when passing in a Courses", async () => {

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //         <Router  >
    //             <CoursesForm initialContents={coursesFixtures.oneCourse} />
    //         </Router>
    //         </QueryClientProvider>
    //     );
    //     await screen.findByTestId(/CoursesForm-id/);
    //     expect(screen.getByText(/Id/)).toBeInTheDocument();
    //     expect(screen.getByTestId(/CoursesForm-id/)).toHaveValue("1");
    // });


    test("Correct Error messsages on missing input", async () => {

        render(
            <QueryClientProvider client={queryClient}>
            <Router  >
                <AddCourseStaffForm />
            </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("AddCourseStaffForm-submit");
        const submitButton = screen.getByTestId("AddCourseStaffForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/User is required./);
        expect(screen.getByText(/User is required/)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <QueryClientProvider client={queryClient}>
            <Router  >
                <AddCourseStaffForm submitAction={mockSubmitAction} />
            </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("AddCourseStaffForm-user");

        const userField = screen.getByTestId("CoursesForm-user");
        const submitButton = screen.getByTestId("CoursesForm-submit");

        fireEvent.change(userField, { target: { value: "pconrad" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <QueryClientProvider client={queryClient}>
            <Router  >
                <AddCourseStaffForm />
            </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("AddCourseStaffForm-cancel");
        const cancelButton = screen.getByTestId("AddCourseStaffForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});