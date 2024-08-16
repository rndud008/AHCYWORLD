import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import { Card, Pagination, Tab, Tabs } from "react-bootstrap";
import "./News.css";

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage] = useState(10);
    const [activeCategory, setActiveCategory] = useState("entertainment");

    const categories = [
        {key: "entertainment", label: "연예"},
        {key: "stock", label: "주식"},
        {key: "technology", label: "과학"},
        {key: "economy", label: "경제"},
        {key: "politics", label: "정치"},
        {key: "society", label: "사회"},
        {key: "world", label: "세계"},
        {key: "sports", label: "스포츠"},
        {key: "weather", label: "날씨"},
    ]

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const url = `${SERVER_HOST}/news/api?category=${activeCategory}`;
                const response = await axios.get(url);
                const { data } = response;

                const cleanNews = data.items.map(item => ({
                    ...item,
                    title: cleanHTML(item.title),
                    description: cleanHTML(item.description),
                }));

                setNews(cleanNews || []);
            } catch (error) {
                console.error("뉴스를 못 찾음", error);
                setNews([]); // 오류가 발생했을 때도 빈 배열로 초기화
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchNews();
    }, [activeCategory]);

    const cleanHTML = (html) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = html;
        let decoded = textArea.value;

        decoded = decoded.replace(/<\/?[^>]+(>|$)/g, "");
        return decoded;
    }

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(news.length / newsPerPage);

    const moveNews = (link) => {
        window.open(link, "_blank");
    };

    return (
        <>
            <div className='news-container'>
            {loading ? (
                <div className='noNews'>Loading...</div>
            ) : news.length > 0 ? (
                <>
                <h1 className="news-title">News</h1>
                <Tabs
                    id="news-category-tabs"
                    activeKey={activeCategory}
                    onSelect={(k) => {
                        setActiveCategory(k);
                        setCurrentPage(1)
                    }}
                >
                    {categories.map((category) => (
                        <Tab
                            eventKey={category.key}
                            title={category.label}
                            key={category.key}
                        >
                            <div className="news-cards">
                                {currentNews.map((item, index) => (
                                    <Card
                                        key={index}
                                        className="news-cards"
                                        onClick={() => moveNews(item.link)}
                                    >
                                        <Card.Body>
                                            <Card.Title>{item.title}</Card.Title>
                                            <Card.Text>{item.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </Tab>
                    ))}
                </Tabs>
                
                <div className="pagination-container">
                    <Pagination>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
                </>
            ) : (
                <div className='noNews'>No News Available</div>
            )}
        </div>
        </>
    );
};

export default News;
