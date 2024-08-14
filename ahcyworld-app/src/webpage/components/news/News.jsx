import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import { Card, Pagination, Tab, Tabs } from "react-bootstrap";
import "./News.css";

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // 한 페이지당 뉴스의 항목 수
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
                const respone = await axios.get(url);
                const { data } = respone;

                const cleanNews = data.items.map(item => ({
                    ...item,
                    title: cleanHTML(item.title),
                    description: cleanHTML(item.description),
                }));

                setNews(cleanNews || []);
            } catch (error) {
                console.error("뉴스를 못 찾음", error);
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        fetchNews();
    }, [activeCategory]);

    const cleanHTML = (html) => {
        // HTML 엔티티 변환
        const textArea = document.createElement('textarea');
        textArea.innerHTML = html;
        let decoded = textArea.value;

        // HTML 태그 제거
        decoded = decoded.replace(/<\/?[^>]+(>|$)/g, "");

        return decoded;
    }

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(news.length / newsPerPage);

    // 뉴스를 클릭 시 해당 뉴스 링크로 이동
    const moveNews = (link) => {
        window.open(link, "_blank"); // 새탭으로 링크 열기
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
