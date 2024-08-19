import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SERVER_HOST } from '../../../../apis/api';
import ItemPagination from '../../../items/components/ItemPagination';
import { Button } from 'react-bootstrap';
import '../css/Items.css';
import UpdateItemModal from './UpdateItemModal';

const Items = () => {
    const [itemType, setItemType] = useState("all");
    const [items, setItems] = useState([]);
    const [pageData, setPageData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [item, setItem] = useState({});
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchValue, setSearchValue] = useState("");
    

    const updateItemopenModal = () => {
        setIsUpdateItemModalOpen(true);
    };

    const updateItemcloseModal = () => {
        setIsUpdateItemModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                window.scroll(0, 0);
                const type = itemType;
                let firstpage = 0;
                if (localStorage.getItem("AdminItemType") === type) {
                    firstpage = currentPage;
                } else {
                    firstpage = 1;
                    setCurrentPage(1);
                }
                const itemResponse = await axios({
                    method: "GET",
                    url: `${SERVER_HOST}/item/admin/${type}`,
                    params: {
                        page: firstpage,
                        searchItem: searchValue,
                    },
                });

                const { status } = itemResponse;
                const items = itemResponse.data.items;
                localStorage.setItem("AdminItemType", type);
                if (status === 200) {
                    setItems(items);
                    setPageData({ ...itemResponse.data });
                    setIsUpdate(false);
                }
            } catch (error) {
                console.error("error data", error);
            }

        }

        fetchData();

    }, [itemType, currentPage, isUpdate]);


    const openUpdateItemModal = (item) => {
        updateItemopenModal();
        setItem(item);
    }

    const changeValue = (e) => {
        setSearchValue(e.target.value.trim());
    }

    const searchItem = () => {
        setIsUpdate(true);
        setCurrentPage(1);
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleSearch();
        }
    }

    const handleSearch = () => {
        searchItem();
    }


    return (
        <>
            <div >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <button style={{ width: 180, height: 50 }} onClick={() => { setItemType("all"); setSearchValue(""); setIsUpdate(true) }} >전체</button>
                    <button style={{ width: 180, height: 50 }} onClick={() => { setItemType("배경음악"); setSearchValue(""); }}>배경음약</button>
                    <button style={{ width: 180, height: 50 }} onClick={() => { setItemType("글꼴"); setSearchValue(""); }}>글꼴</button>
                    <button style={{ width: 180, height: 50 }} onClick={() => { setItemType("미니미"); setSearchValue(""); }}>미니미</button>
                    <button style={{ width: 180, height: 50 }} onClick={() => { setItemType("스토리룸"); setSearchValue(""); }}>미니룸</button>
                    <button style={{ width: 180, height: 50 }} onClick={() => { setItemType("스킨"); setSearchValue(""); }}>스킨</button>
                    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <input type='text' value={searchValue} onChange={(e) => changeValue(e)} onKeyDown={handleKeyDown} style={{ height: '40px' }} />
                        <button style={{ width: '50px', height: '40px' }} onClick={() => searchItem()}>검색</button>
                    </div>

                </div>

                <hr />
                <table className='items-table'>
                    <thead className='items-thead'>
                        <tr>
                            <th>id</th>
                            <th>이미지</th>
                            <th>상품이름</th>
                            <th>상품타입</th>
                            <th>도토리가격</th>
                            <th>현재상태</th>
                            <th>상태변경</th>

                        </tr>
                    </thead>
                    <tbody className='items-tbody'>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                {item.itemType === '글꼴' ? (
                                    <td style={{ width: '150px', height: '120px' }}>
                                        <input
                                            type='text'
                                            style={{ fontFamily: `${item.sourceName}, cursive`, fontSize: 13, width: '100%', height: '100%', boxSizing: 'border-box' }}
                                            value='AhCyWorld'
                                            readOnly
                                        />
                                    </td>
                                ) : item.itemType === '배경음악' ? (
                                    <td style={{ width: '150px', height: '120px' }}>
                                        <img style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} className="itemImg" src={item.bgmImg} alt="" />
                                    </td>
                                ) : (
                                    <td style={{ width: '150px', height: '120px' }}>
                                        <img
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} className="itemImg"
                                            src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                                            alt=""
                                        />
                                    </td>
                                )}
                                <td>{item.itemName}</td>
                                <td>{item.itemType}</td>
                                <td>{item.price}</td>
                                <td>{item.status}</td>
                                <td className='state-btn-box' style={{ height: '120px' }}>

                                    <Button
                                        variant='danger'
                                        className='state-invisible'
                                        onClick={() => openUpdateItemModal(item)}
                                    >
                                        수정
                                    </Button>




                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="itemPagination" style={{ marginTop: '20px' }}>
                    <ItemPagination pageData={pageData} setCurrentPage={setCurrentPage} />
                </div>

            </div>
            <UpdateItemModal isOpen={isUpdateItemModalOpen} ModalonClose={updateItemcloseModal} updateitem={item} setIsUpdate={setIsUpdate} />
        </>
    );
};

export default Items;