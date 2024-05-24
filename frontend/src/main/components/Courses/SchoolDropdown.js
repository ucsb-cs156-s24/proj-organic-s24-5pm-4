import React from "react";
import { Form } from "react-bootstrap";
import {useFormContext} from "react-hook-form";

//This is roughly based on the schedule dropdown from Courses, available
//at https://github.com/ucsb-cs156/proj-courses/blob/main/frontend/src/main/components/PersonalSchedules/PersonalScheduleDropdown.js

const SchoolDropdown = ({schools, testId}) => {
    const {
        register,
        formState: {errors}
    } = useFormContext();

    return (<Form.Group>
        <Form.Label htmlFor="school">School</Form.Label>
        <Form.Control data-testid={`${testId}-schooldropdown`} id="school"  as="select"
          isInvalid={Boolean(errors.school)}
          {...register("school", {required: true, minLength: 2})}
        >
            <option value=""></option>
            {schools.map(function (object, i) {
                const key = `${testId}-option-${i}`
                console.log("This ran");
                return(
                    <option key={key} data-testid={key} value={object.abbrev}>
                        {object.name}
                    </option>
                );
            })}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
            {errors.school && 'School is required. '}
        </Form.Control.Feedback>
    </Form.Group>);
}

export default SchoolDropdown;