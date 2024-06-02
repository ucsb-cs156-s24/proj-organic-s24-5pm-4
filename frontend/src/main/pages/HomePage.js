import React from "react";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function HomePage() {
    const { data: currentUser } = useCurrentUser();

    const getPartOfDayGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const greeting = getPartOfDayGreeting();


    // Determine the username to display based on currentUser status
    const username = currentUser && currentUser.loggedIn ? currentUser.root.user.githubLogin: "Please Sign in to Proceed";

    return (
        <div data-testid={"HomePage-main-div"}>
            <BasicLayout>
                <h1 data-testid="homePage-title" style={{ fontSize: "75px", borderRadius: "7px", backgroundColor: "white", opacity: ".9" }} className="text-center border-0 my-3">
                    {greeting}, {username}
                </h1>
                <h2 data-testid="homePage-info">
                    This app is intended as a replacement for the <a href="https://ucsb-cs-github-linker.herokuapp.com">ucsb-cs-github-linker</a> app used in many courses at UCSB, as well as some courses at other universities.
                </h2>
            </BasicLayout>
        </div>
    );
}
