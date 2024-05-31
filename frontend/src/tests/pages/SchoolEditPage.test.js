import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolEditPage from "main/pages/SchoolEditPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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
            abbrev: "ucsb"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("SchoolEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/schools", { params: { abbrev: "ucsb" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit School");
            expect(screen.queryByTestId("SchoolForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/schools", { params: { abbrev: "ucsb" } }).reply(200, {
                abbrev: "ucsb",
                name: "UC Santa Barbara",
                termRegex: "[wsmf]\\d\\d",
                termDescription: "s24",
            });
            axiosMock.onPut('/api/schools/update').reply(200, {
                abbrev: "ucsb", // we do not want to change the abbrev as it is our new key param instead of id
                name: "Edited UC Santa Barbara",
                termRegex: "[wsmf]\\d\\d",
                termDescription: "f24",
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("SchoolForm-abbrev");

            const abbrevField = screen.getByTestId("SchoolForm-abbrev");
            const nameField = screen.getByTestId("SchoolForm-name");
            const termRegexField = screen.getByTestId("SchoolForm-termRegex");
            const termDescriptionField = screen.getByTestId("SchoolForm-termDescription");
            const submitButton = screen.getByTestId("SchoolForm-submit");

            expect(abbrevField).toBeInTheDocument();
            expect(abbrevField).toHaveValue("ucsb");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("UC Santa Barbara");
            expect(termRegexField).toBeInTheDocument();
            expect(termRegexField).toHaveValue("[wsmf]\\d\\d");
            expect(termDescriptionField).toBeInTheDocument();
            expect(termDescriptionField).toHaveValue("s24");


            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(nameField, { target: { value: "Edited UC Santa Barbara" } });
            fireEvent.change(termRegexField, { target: { value: "[wsmf]\\d\\d" } });
            fireEvent.change(termDescriptionField, { target: { value: "f24" } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("School Updated - abbrev: ucsb name: Edited UC Santa Barbara");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/schools" });

            expect(axiosMock.history.put.length).toBe(1); 
            expect(axiosMock.history.put[0].params).toEqual({ abbrev: "ucsb" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "Edited UC Santa Barbara",
                termRegex: "[wsmf]\\d\\d",
                termDescription: "f24",
            })); 
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            const abbrevField = screen.getByTestId("SchoolForm-abbrev");
            const nameField = screen.getByTestId("SchoolForm-name");
            const termRegexField = screen.getByTestId("SchoolForm-termRegex");
            const termDescriptionField = screen.getByTestId("SchoolForm-termDescription");
            const submitButton = screen.getByTestId("SchoolForm-submit");

            expect(abbrevField).toHaveValue("ucsb");
            expect(nameField).toHaveValue("UC Santa Barbara");
            expect(termRegexField).toHaveValue("[wsmf]\\d\\d");
            expect(termDescriptionField).toHaveValue("s24");

            fireEvent.change(nameField, { target: { value: "Edited UC Santa Barbara" } });
            fireEvent.change(termRegexField, { target: { value: "[wsmf]\\d\\d" } });
            fireEvent.change(termDescriptionField, { target: { value: "f24" } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("School Updated - abbrev: ucsb name: Edited UC Santa Barbara");
            expect(mockNavigate).toBeCalledWith({ "to": "/schools" });
        });

       
    });
});