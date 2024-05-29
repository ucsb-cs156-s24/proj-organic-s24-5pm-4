import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CoursesStaffPage from "main/pages/CoursesStaffPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { staffFixture } from "fixtures/staffFixture";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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

describe("CoursesStaffPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "StaffTable";

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/courses/getStaff", { params: { id: 17 } }).timeout();
    };

    const setupInstructorUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.instructorUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/courses/getStaff", { params: { id: 17 } }).timeout();
    }

    const setupUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/courses/getStaff", { params: { id: 17 } }).timeout();
    }

    test("Renders with Add Staff Button for admin user", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Add Staff Member/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Add Staff Member/);
        expect(button).toHaveAttribute("href", "/courses/17/addStaff");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("Renders with Add Staff Button for instructor user", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Add Staff Member/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Add Staff Member/);
        expect(button).toHaveAttribute("href", "/courses/17/addStaff");
        expect(button).toHaveAttribute("style", "float: right;");
    });
    
    test("Renders without Add Staff for non admin and non instructor user", async () => {
        // arrange
        setupUser(); 
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, []);
    
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        // assert
        await waitFor(() => {
            expect(screen.queryByText(/Add Staff Member/)).not.toBeInTheDocument();
        });
    });
    
    test("renders three staff members correctly for admin", async () => {    
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, staffFixture.threeStaff);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders three staff members correctly for instructor", async () => {      
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, staffFixture.threeStaff);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders empty table when backend unavailable, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
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
        axiosMock.onGet("/api/courses/getStaff").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, staffFixture.threeStaff);
        // axiosMock.onDelete("/api/courses/delete").reply(200, "Course with id 1 was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        // await waitFor(() => { expect(mockToast).toBeCalledWith("Course with id 1 was deleted") });

    });

    test("what happens when you click delete, instructor", async () => {
        // arrange
        setupInstructorUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, staffFixture.threeStaff);
        // axiosMock.onDelete("/api/courses/delete").reply(200, "Course with id 1 was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        // await waitFor(() => { expect(mockToast).toBeCalledWith("Course with id 1 was deleted") });

    });

    test("tests buttons for editing do not show up for user", async () => {
        // arrange
        setupUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/courses/getStaff").reply(200, staffFixture.threeStaff);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CoursesStaffPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
        expect(screen.queryByText(/Add Staff Member/)).not.toBeInTheDocument();


        // assert

    });

});


