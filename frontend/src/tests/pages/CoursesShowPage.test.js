import {render, waitFor, screen, fireEvent} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CoursesShowPage from "main/pages/CoursesShowPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { coursesFixtures } from "fixtures/coursesFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import userEvent from "@testing-library/user-event";
import {studentsFixtures} from "../../fixtures/studentsFixtures";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CoursesShowPage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "CoursesTable";

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupInstructorUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.instructorUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    }



    test("renders course correctly for admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });

    });

    test("renders course correctly for instructor", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });

    });

    test("renders empty table when backend unavailable, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, instructor", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("ensures Show and Delete do not appear", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
        const show = screen.queryByTestId(`${testId}-cell-row-0-col-Show-button`);
        expect(show).not.toBeInTheDocument();
    });


    /*
    Thank you stack overflow for this tip
    https://stackoverflow.com/questions/61104842/react-testing-library-how
    -to-simulate-file-upload-to-a-input-type-file-e
    Told me how to upload a file
    */

    test("Successfully makes a call to the backend on submit", async () => {
        const file = new File(['there'], 'egrades.csv', {type: 'text/csv'});
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onPost("/api/students/upload/egrades").reply(202, {
            "filename":"egrades.csv",
            "message":"Inserted 0 new students, Updated 3 students"
        });
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByTestId("StudentsForm-upload");

        const upload = screen.getByTestId("StudentsForm-upload");
        const submitButton = screen.getByTestId("StudentsForm-submit");
        await user.upload(upload, file);
        fireEvent.click(submitButton);
        await waitFor(() => {expect(axiosMock.history.post[0].params).toEqual({
                "courseId": 17
            }
        );});
        expect(axiosMock.history.post[0].headers).toEqual({
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'multipart/form-data'
        })
        expect(axiosMock.history.post[0].data.get("file")).toEqual(file);
        expect(mockToast).toBeCalledWith("Student roster successfully uploaded.");
    });

    test("No crash on timeout", async () => {
        const file = new File(['there'], 'egrades.csv', {type: 'text/csv'});
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onPost("/api/students/upload/egrades", { params: { courseId: 17 } }).timeout();
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByTestId("StudentsForm-upload");

        const upload = screen.getByTestId("StudentsForm-upload");
        const submitButton = screen.getByTestId("StudentsForm-submit");
        await user.upload(upload, file);
        fireEvent.click(submitButton);

        await waitFor(() => {expect(mockToast).toBeCalledWith("Error communicating with backend on /api/students/upload/egrades");});
    });

    test("Correctly Transmit backend reject", async () => {
        const file = new File(['there'], 'egrades.csv', {type: 'text/csv'});
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onPost("/api/students/upload/egrades").reply(400, {
            "filename":"egrades.csv",
            "message":"File Rejected"
        });
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await screen.findByTestId("StudentsForm-upload");

        const upload = screen.getByTestId("StudentsForm-upload");
        const submitButton = screen.getByTestId("StudentsForm-submit");
        await user.upload(upload, file);
        fireEvent.click(submitButton);

        await waitFor(() => {expect(mockToast).toBeCalledWith("File Rejected");});
    });


    test("No crashes when no backend for table, and table doesn't have headers", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);
        axiosMock.onGet("/api/students/all", {params: {courseId: 17}}).timeout();
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.queryByTestId(`StudentsTable-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("Table renders correctly for admin", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);
        axiosMock.onGet("/api/students/all", {params: {courseId: 17}}).reply(200, studentsFixtures.threeStudents);
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`StudentsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`StudentsTable-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`StudentsTable-cell-row-2-col-id`)).toHaveTextContent("3");
    });

    test("Table renders correctly for instructor", async () => {
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/get", { params: { id: 17 } }).reply(200, coursesFixtures.threeCourses[0]);
        axiosMock.onGet("/api/students/all", {params: {courseId: 17}}).reply(200, studentsFixtures.threeStudents);
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesShowPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`StudentsTable-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`StudentsTable-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`StudentsTable-cell-row-2-col-id`)).toHaveTextContent("3");
    });

});


