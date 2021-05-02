import React, {FunctionComponent, useEffect, useState} from "react";
import Link from 'next/link'
import {CreateUserEntity, User} from "utils/models";
import {getUsers, postUser} from "utils/workflow-api";
import CreateUserModal from "components/modals/create-user-modal";

const Start: FunctionComponent = (): JSX.Element => {
    // STATE
    const initState: Array<User> = []
    const [state, setState] = useState(initState);
    const [showCreateModal, setShowCreateModal] = useState(false);

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

    const openModal = () => {
        setShowCreateModal(true);
    }
    const closeModal = () => {
        setShowCreateModal(false);
    }

    const createUser = async (createUserEntity: CreateUserEntity) => {
        postUser(createUserEntity)
            .then(res => {
                if (res) {
                    getUsers().then(users => {
                        if (users) {
                            setState(users)
                        }
                    })
                }
            })
    }

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
                        openModal()
                    }>
                    create a new user.
                </button>
            </div>
            <ul>
                {state.map((user, index) => {
                    return (
                        <li key={index}>
                            <Link href={"/" + user.username}>
                                <div
                                    className="grid items-center justify-center bg-blue-300 hover:bg-blue-200 cursor-pointer border border-gray-500 rounded shadow p-1 w-80 h-10 mt-2">
                                    {user.username}
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <CreateUserModal show={showCreateModal} closeModal={closeModal} createUser={createUser}/>
        </div>
    )
}

export default Start
