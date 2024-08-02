import React from "react";

const JoinForm = ({join}) => {
    const onJoin = (e) => {
        e.preventDefault();

        const username = e.target.username.value;
        const password = e.target.username.value;
        

        console.log("유저아이디랑 비밀번호: ", username, password);

        join({ username, password });
    };

    return (
        <div className='form'>
            <h2 className='login-title'>Join</h2>

            <form className='login-form' onSubmit={(e) => onJoin(e)}>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input
                        id='username'
                        type='text'
                        placeholder='Username'
                        name='username'
                        autoComplete='username'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        id='password'
                        type='password'
                        placeholder='Password'
                        name='password'
                        autoComplete='current-password'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>name</label>
                    <input
                        id='name'
                        type='text'
                        placeholder='name'
                        name='name'
                        autoComplete='name'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Email</label>
                    <input
                        id='email'
                        type='text'
                        placeholder='Email'
                        name='email'
                        autoComplete='email'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Gender</label>
                    <input
                        id='gender'
                        type='text'
                        placeholder='Gender'
                        name='gender'
                        autoComplete='gender'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>BirthDay</label>
                    <input
                        id='birthDay'
                        type='text'
                        placeholder='BirthDay'
                        name='birthDay'
                        autoComplete='birthDay'
                        required
                    />
                </div>

                <button className='btn btn--form btn-login' type='submit'>
                    Join
                </button>
            </form>
        </div>
    );
};

export default JoinForm;
