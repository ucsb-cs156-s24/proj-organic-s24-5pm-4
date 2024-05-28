import { Button, Form, Row, Col } from 'react-bootstrap';
import {FormProvider, useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import React from 'react';
import {useBackend} from "../../utils/useBackend";
import CourseDropdown from "./CourseDropdown";
import UserDropdown from '../Users/UserDropdown';

function AddCourseStaffForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    // Stryker disable all
    const formState = useForm({defaultValues:initialContents || {},})

    const {
        register,
        handleSubmit,
    } = formState;

    const { data: courses, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/courses/all"],
            // Stryker disable next-line all : GET is the default
            { method: "GET", url: "/api/courses/all" },
            []
        );

    const { data: users, error: __error, status: __status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/admin/users"],
            // Stryker disable next-line all : GET is the default
            { method: "GET", url: "/api/admin/users" },
            []
        );


    const navigate = useNavigate();
    
    // Stryker restore all
    
    return (
        <FormProvider {...formState}>
            <Form onSubmit={handleSubmit(submitAction)}>


                <Row>

                    {initialContents && (
                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label htmlFor="id">Id</Form.Label>
                                <Form.Control
                                    data-testid="AddCourseStaffForm-id"
                                    id="id"
                                    type="text"
                                    {...register("id")}
                                    value={initialContents.id}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    )}
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" >
                            <CourseDropdown testId="AddCourseStaffForm" courses={courses}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" >
                            <UserDropdown testId="AddCourseStaffForm" users={users}/>
                        </Form.Group>
                    </Col>
                    
                </Row>

                <Row>
                    <Col>
                        <Button
                            type="submit"
                            data-testid="AddCourseStaffForm-submit"
                        >
                            {buttonLabel}
                        </Button>
                        <Button
                            variant="Secondary"
                            onClick={() => navigate(-1)}
                            data-testid="AddCourseStaffForm-cancel"
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Form>
        </FormProvider>
    )
}

export default AddCourseStaffForm

/*
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import CourseDropdown from './CourseDropdown';
import { useBackend } from 'main/utils/useBackend';

function AddCourseStaffForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );

    const { data: courses, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/schools/all"],
            // Stryker disable next-line all : GET is the default
            { method: "GET", url: "/api/schools/all" },
            []
        );

    // Stryker restore all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="AddCourseStaffForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <CourseDropdown testId="AddCourseStaffForm" courses={courses}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="githubId">Github Id</Form.Label>
                        <Form.Control
                            data-testid="AddCourseStaffForm-githubId"
                            id="githubId"
                            type="text"
                            isInvalid={Boolean(errors.githubId)}
                            {...register("githubId", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.githubId && 'githubId is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="AddCourseStaffForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="AddCourseStaffForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default AddCourseStaffForm
*/