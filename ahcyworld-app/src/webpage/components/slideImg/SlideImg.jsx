import React, { useState } from "react";
import "./SlideImg.css";
import Carousel from "react-bootstrap/Carousel";
import ExampleImg from "./ExampleImg";

const SlideImg = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            <div className="slideImg-container">
                <Carousel activeIndex={index} onSelect={handleSelect}>
                    <Carousel.Item>
                        <ExampleImg
                            text="First slide"
                            imageUrl="/image/라이언.png"
                        />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>
                                첫번째 이미지
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <ExampleImg
                            text="Second slide"
                            imageUrl="/image/렌고쿠.png"
                        />
                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>
                                두번째 이미지
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <ExampleImg
                            text="Third slide"
                            imageUrl="/image/마루.png"
                        />
                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>
                                세번째 이미지
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </>
    );
};

export default SlideImg;
