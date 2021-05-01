import React, {FunctionComponent, useEffect, useState} from "react";
import Link from 'next/link'
import {User, WorkflowList} from "utils/models";
import {getUsers, getWorkflowLists} from "utils/workflow-api";

const Start: FunctionComponent = (): JSX.Element => {
    // STATE
    const initState: Array<User> = []
    const [state, setState] = useState(initState);

    useEffect(() => {
        init();
    }, []);

    // FUNCTIONS
    const init = () => {
        getUsers().then(users => {
            if (users) {
                setState(users)
            }
        })
    }
    const username = "timo"
    return (
        <div className="flex flex-col items-center align-top bg-gray-200 h-screen p-3 ">
            <p className="text-4xl mb-5">
                Welcome to Khipu
            </p>
            <div className="flex">
                <div className="">
                    Select an existing user or&nbsp;
                </div>
                <button
                    className="text-blue-500 underline"
                    onClick={() =>
                    console.log("CREATE USER")}>
                    create a new user.
                </button>
            </div>

            <ul>
                {state.map((user, index) => {
                    return (
                        <li key={index}>
                            <div className="grid items-center justify-center bg-blue-300 hover:bg-blue-200 cursor-pointer border border-gray-500 rounded shadow p-1 w-80 h-10 mt-2">

                                <Link href={"/" + user.username + "/home"}>
                                    <a>{user.username}</a>
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Start
