import { Button, Form, Row, Col } from 'react-bootstrap';
import {FormProvider, useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import React from 'react';
import {useBackend} from "../../utils/useBackend";
import UserDropdown from '../Users/UserDropdown';

function AddCourseStaffForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    // Stryker disable all
    const formState = useForm({defaultValues:initialContents || {},})

    const {
        register,
        handleSubmit,
    } = formState;

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
                            <UserDropdown testId="AddCourseStaffForm-user" users={users}/>
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