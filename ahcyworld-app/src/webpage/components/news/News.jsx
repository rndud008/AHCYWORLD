import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import { Pagination } from "react-bootstrap";
import "./News.css";

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // 한 페이지당 뉴스의 항목 수
    const [newsPerPage] = useState(10);

    useEffect(() => {

        const fetchNews = async () => {
            try {
                const response = await axios.get(`${SERVER_HOST}/news/api`);
                const { data } = response;
                // console.log("API data:", data);

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
    }, []);

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
                <table className='news-table'>
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>내용</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentNews.map((item, index) => (
                            <tr
                                key={index}
                                className='news-item'
                                onClick={() => moveNews(item.link)}
                            >
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
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
                </>
            ) : (
                <div className='noNews'>No News Available</div>
            )}
        </div>
        </>
    );
};

export default News;
