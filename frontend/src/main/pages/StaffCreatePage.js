import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AddCourseStaffForm from "main/components/Courses/AddCourseStaffForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function StaffCreatePage({storybook=false}) {
    // Hack-y way of getting the course id
    // Gets the current URL, extracts the course id from it
    const currentUrl = window.location.href;
    var field = currentUrl.split('courses')[1];
    let matches = field[1].match(/(\d+)/);
    const objectToAxiosParams = (staff) => ({
        url: "/api/courses/addStaff",
        method: "POST",
        params: {
        courseId: parseInt(matches[0]),
        githubLogin: staff.users
        }
    });

    const onSuccess = (staff) => {
        toast(`New staff created - id: ${staff.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess }, 
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/courses/all"] // mutation makes this key stale so that pages relying on it reload
        );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }
    
    if (isSuccess && !storybook) {
        return <Navigate to="/courses" />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Add New Staff Member</h1>

            <AddCourseStaffForm submitAction={onSubmit} />

        </div>
        </BasicLayout>
    )
}