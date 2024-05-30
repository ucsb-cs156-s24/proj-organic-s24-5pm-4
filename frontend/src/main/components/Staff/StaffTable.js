import React from "react";
 import OurTable, { ButtonColumn } from "main/components/OurTable"
 import { useBackendMutation } from "main/utils/useBackend";
 import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/components/Utils/StaffUtils"
 import { hasRole } from "main/utils/currentUser";


 export default function StaffTable({ staff, currentUser }) {
    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/courses/:id/staff"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

     const columns = [
         {
             Header: 'id',
             accessor: 'id',
         },
         {
             Header: 'courseId',
             accessor: 'courseId',
         },
         {
             Header: 'githubId',
             accessor: 'githubId',
         },
   
     ];

     if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) {
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "StaffTable"));
    }

    return (
        <>
            <div>Total Staff: {staff.length}</div>
          <OurTable data={staff} columns={columns} testid={"StaffTable"} />
        </>
      );
    };