import React from "react";
import { Form } from "react-bootstrap";
import {useFormContext} from "react-hook-form";

const UserDropdown = ({users = [], testId}) => {
    const {
        register,
        formState: {errors}
    } = useFormContext();

    return (<Form.Group>
        <Form.Label htmlFor="users">User</Form.Label>
        <Form.Control data-testid={`${testId}-users`} id="users"  as="select"
          isInvalid={Boolean(errors.users)}
          {...register("users", {required: true, minLength: 2})}
        >
            <option value=""></option>
            {users.map(function (object, i) {
                const key = `${testId}-option-${i}`
                return(
                    <option key={key} data-testid={key} value={object.githubLogin}>
                        {object.githubLogin}
                    </option>
                );
            })}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
            {errors.users && 'User is required. '}
        </Form.Control.Feedback>
    </Form.Group>);
}

export default UserDropdown;