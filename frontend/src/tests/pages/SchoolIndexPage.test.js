import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolIndexPage from "main/pages/SchoolIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";
import { schoolsFixtures } from "fixtures/schoolsFixtures";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("SchoolIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "SchoolTable";

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("Renders with Create Button for admin user", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor( ()=>{
            expect(screen.getByText(/Create School/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create School/);
        expect(button).toHaveAttribute("href", "/schools/create"); //fixme could have bug because plural
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three schools correctly for admin", async () => {    
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, schoolsFixtures.threeSchools);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-abbrev`)).toHaveTextContent("umn");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-abbrev`)).toHaveTextContent("ucsd");

    });

    test("renders empty table when backend unavailable, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").timeout();
        const restoreConsole = mockConsole();

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        restoreConsole();

        expect(screen.queryByTestId(`${testId}-cell-row-0-col-abbrev`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        // arrange
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/schools/all").reply(200, schoolsFixtures.threeSchools);
        axiosMock.onDelete("/api/schools").reply(200, "School with abbrev ucsb was deleted");

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => { expect(screen.getByTestId(`SchoolTable-cell-row-0-col-abbrev`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        // act
        fireEvent.click(deleteButton);

        // assert
        await waitFor(() => { expect(mockToast).toBeCalledWith("School with abbrev ucsb was deleted") });

    });


});


