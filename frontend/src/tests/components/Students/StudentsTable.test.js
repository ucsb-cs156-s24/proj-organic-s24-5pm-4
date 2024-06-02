import StudentsTable from "main/components/Students/StudentsTable"
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import {  render, screen } from "@testing-library/react";
import { studentsFixtures } from "fixtures/studentsFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("StudentsTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StudentsTable students={studentsFixtures.threeStudents} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "courseId", "fname", "lname", "studentId", "email", "githubId", "user"];
    const expectedFields = ["id", "courseId", "fname", "lname", "studentId", "email", "githubId", "user"];
    const testId = "StudentsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const totalStudentElement = screen.getByText("Total Students: 3"); // Assuming there are 3 students in the fixture
    expect(totalStudentElement).toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-cell-row-0-col-courseId`)).toHaveTextContent(3);
    expect(screen.getByTestId(`${testId}-cell-row-0-col-fname`)).toHaveTextContent("CHRIS FAKE");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-lname`)).toHaveTextContent("GAUCHO");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-studentId`)).toHaveTextContent("A123456");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("cgaucho@umail.ucsb.edu");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-githubId`)).toHaveTextContent("banana");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-user`)).toHaveTextContent("mama mia");
  });


  
  test("renders empty table correctly", () => {

    // arrange
    const currentUser = currentUserFixtures.adminUser;
    const expectedHeaders = ["id", "courseId", "fname", "lname", "studentId", "email", "githubId", "user"];
    const expectedFields = ["id", "courseId", "fname", "lname", "studentId", "email", "githubId", "user"];
    const testId = "StudentsTable";
    
    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StudentsTable students={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });

    const totalStudentsElement = screen.getByText("Total Students: 0"); // Since the table is empty
    expect(totalStudentsElement).toBeInTheDocument();
  });

});