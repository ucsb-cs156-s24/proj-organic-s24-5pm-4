import StudentsForm from "../../../main/components/Students/StudentsForm";


export default{
    title: "components/Students/StudentsForm",
    component: StudentsForm
}

const Template = (args) => {
    return(
        <StudentsForm {...args} />
    );
}

export const Default = Template.bind({});

Default.args={
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
}