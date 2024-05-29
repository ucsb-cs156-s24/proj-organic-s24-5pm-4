import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import StaffTable from 'main/components/Staff/StaffTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser, hasRole} from 'main/utils/currentUser';
import { useParams } from "react-router-dom";

export default function CourseIndexPage() {

  const { data: currentUser } = useCurrentUser();
  let { id } = useParams();
  const addStaffButton = () => {  
    
      return (
          <Button
              variant="primary"
              href={"/courses/" + id + "/addStaff"}
              style={{ float: "right" }}
          >
              Add Staff Member
          </Button>
      )
    
  }
  
  const { data: staff, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/courses?id=${id}/staff`],
      // Stryker disable next-line all : GET is the default
      { method: "GET", url: "/api/courses/getStaff", params: { courseId: parseInt(id) } },
      []
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          {(hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) && addStaffButton()}
          <h1>Staff</h1>
          <StaffTable staff={staff} currentUser={currentUser} />
    
        </div>
      </BasicLayout>
    )
}