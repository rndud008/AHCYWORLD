import React from "react";
import styled from "styled-components";
import backgroundImg from '../../../upload/배경1.png'

const StyledHeader = styled.div`
    width: auto;
    height: 400px;
    background-image: url(${backgroundImg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
`;

// const StyledHeaderground = styled.div`
//     background-color: #ffc423;
//     height: 100px;
// `;

const Headerr = () => {
    return (
        <>
            <StyledHeader></StyledHeader>
        </>
    );
};

export default Headerr;
