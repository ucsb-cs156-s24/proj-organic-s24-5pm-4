import React from 'react'
import {useBackend} from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { useCurrentUser} from 'main/utils/currentUser';
import {useParams} from "react-router-dom";
import StudentsForm from "../components/Students/StudentsForm";
import {toast} from "react-toastify";
import axios from "axios";
import StudentsTable from "../components/Students/StudentsTable";

export default function CoursesShowPage() {
    let { id } = useParams();
    const { data: currentUser } = useCurrentUser();

    const { data: courses, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/courses?id=${id}`],

            { // Stryker disable next-line all : GET is the default
                method: "GET", url: "/api/courses/get",
                params: {
                    id
                },
            },
    []
        );

    const { data: students, error: _studenterror, status: _studentStatus } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/students/all?courseId=${id}`],

            { // Stryker disable next-line all : GET is the default
                method: "GET", url: "/api/students/all",
                params: {
                    courseId:id
                },
            },
            []
        );
    //this ensures the table row doesn't show up when there's no backend
    let passIn;
    if(courses.length !== 0){
        passIn = [courses]
    }else{
        passIn = courses;
    }
    /*I couldn't get useBackendMutation to work, so this is a hodgepodge of work from this stack overflow url:
    * https://stackoverflow.com/questions/71035309/file-upload-using-axios-in-react
    * and useBackend.js*/
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.upload[0]);
        try {
            await axios.post("/api/students/upload/egrades", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params:{
                    courseId: id
                }
            });
            toast("Student roster successfully uploaded.");
        }catch(e){
            if (e.response.data?.message) {
                toast(e.response.data.message);
            } else {
                const errorMessage = `Error communicating with backend on /api/students/upload/egrades`;
                toast(errorMessage);
            }
        }
    }


    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Course</h1>
                <CoursesTable courses={passIn} currentUser={currentUser}/>
            </div>
            <div>
                <div className="row pt-3">
                    <div className="col col-8">
                        <h2>Student Roster</h2>
                        <StudentsTable students={students}/>
                    </div>
                    <div className="col col-4">
                        <StudentsForm submitAction={onSubmit}/>
                    </div>
                </div>
            </div>
        </BasicLayout>
);
}
