import React from "react";
import { Form } from "react-bootstrap";
import {useFormContext} from "react-hook-form";

const SchoolDropdown = ({schools = [], testId}) => {
    const {
        register,
        formState: {errors},
        formState
    } = useFormContext();

    return (<Form.Group>
        <Form.Label htmlFor="school">School</Form.Label>
        <Form.Control data-testid={`${testId}-school`} id="school"  as="select"
          isInvalid={Boolean(errors.school)}
          {...register("schoolAbbrev", {required: true, minLength: 2})}
            value={formState.defaultValues.schoolAbbrev}
        >
            <option value=""></option>
            {schools.map(function (object, i) {
                const key = `${testId}-option-${i}`
                return(
                    <option key={key} data-testid={key} value={object.abbrev}>
                        {object.name}
                    </option>
                );
            })}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
            {errors.schoolAbbrev && 'School is required. '}
        </Form.Control.Feedback>
    </Form.Group>);
}

export default SchoolDropdown;