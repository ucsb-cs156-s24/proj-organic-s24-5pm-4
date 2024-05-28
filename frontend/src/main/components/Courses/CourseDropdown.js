import React from "react";
import { Form } from "react-bootstrap";
import {useFormContext} from "react-hook-form";

const CourseDropdown = ({courses = [], testId}) => {
    const {
        register,
        formState: {errors}
    } = useFormContext();

    return (<Form.Group>
        <Form.Label htmlFor="courses">Course</Form.Label>
        <Form.Control data-testid={`${testId}-courses`} id="courses"  as="select"
          isInvalid={Boolean(errors.courses)}
          {...register("courses", {required: true, minLength: 2})}
        >
            <option value=""></option>
            {courses.map(function (object, i) {
                const key = `${testId}-option-${i}`
                return(
                    <option key={key} data-testid={key} value={object.name}>
                        {object.name}
                    </option>
                );
            })}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
            {errors.courses && 'Course is required. '}
        </Form.Control.Feedback>
    </Form.Group>);
}

export default CourseDropdown;