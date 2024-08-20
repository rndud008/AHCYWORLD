import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SERVER_HOST } from '../../../../apis/api';
import ItemPagination from '../../../items/components/ItemPagination';
import { Button } from 'react-bootstrap';
import '../css/Items.css';
import UpdateItemModal from './UpdateItemModal';
import { BsSearch } from 'react-icons/bs';

const Items = () => {
    const [itemType, setItemType] = useState("all");
    const [items, setItems] = useState([]);
    const [pageData, setPageData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [item, setItem] = useState({});
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchValue, setSearchValue] = useState("");

    const [btnColors, setBtnColors] = useState({
        all: 'white',
        allColor: 'black',
        music: '#0d6efd',
        musicColor: 'white',
        font: '#0d6efd',
        fontColor: 'white',
        minimi: '#0d6efd',
        minimiColor: 'white',
        miniroom: '#0d6efd',
        miniroomColor: 'white',
        skin: '#0d6efd',
        skinColor: 'white'
    });


    const updateItemopenModal = () => {
        setIsUpdateItemModalOpen(true);
    };

    const updateItemcloseModal = () => {
        setIsUpdateItemModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
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
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = () => {
        searchItem();
    }

    const handleChangeColor = (e) => {
        const clickedButton = e.target.name;
        // 모든 버튼의 색을 초기화
        const newColors = Object.keys(btnColors).reduce((colors,key,index) => {
            if(index%2 === 0){
                colors[key] = '#0d6efd';
            }else{
                colors[key] = 'white'
            }
            return colors;
        }, {});
        // 클릭된 버튼의 색을 white로 변경
        newColors[clickedButton] = 'white';
        newColors[clickedButton+'Color'] = 'black'

        setBtnColors(newColors);
    };

    return (
        <>
            <div >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button className='items-category-button' style={{ background: btnColors['all'], color:btnColors['allColor'] }} name='all' onClick={(e) => { setItemType("all"); setSearchValue(""); setIsUpdate(true); handleChangeColor(e); }} >전체</button>
                    <button className='items-category-button' style={{ background: btnColors['music'], color:btnColors['musicColor'] }} name='music' onClick={(e) => { setItemType("배경음악"); setSearchValue(""); handleChangeColor(e); }}>배경음약</button>
                    <button className='items-category-button' style={{ background: btnColors['font'], color:btnColors['fontColor'] }} name='font' onClick={(e) => { setItemType("글꼴"); setSearchValue(""); handleChangeColor(e); }}>글꼴</button>
                    <button className='items-category-button' style={{ background: btnColors['minimi'], color:btnColors['minimiColor'] }} name='minimi' onClick={(e) => { setItemType("미니미"); setSearchValue(""); handleChangeColor(e); }}>미니미</button>
                    <button className='items-category-button' style={{ background: btnColors['miniroom'], color:btnColors['miniroomColor'] }} name='miniroom' onClick={(e) => { setItemType("스토리룸"); setSearchValue(""); handleChangeColor(e); }}>미니룸</button>
                    <button className='items-category-button' style={{ background: btnColors['skin'], color:btnColors['skinColor'] }} name='skin' onClick={(e) => { setItemType("스킨"); setSearchValue(""); handleChangeColor(e); }}>스킨</button>
                    {/* <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <input type='text' value={searchValue} onChange={(e) => changeValue(e)} onKeyDown={handleKeyDown} style={{ height: '40px' }} />
                        <button style={{ width: '50px', height: '40px' }} onClick={() => searchItem()}>검색</button>
                    </div> */}
                    <div className='items-search-box'>
                        <input
                            type='text'
                            placeholder='Search by itemname'
                            value={searchValue}
                            onChange={(e) => changeValue(e)}
                            onKeyDown={handleKeyDown}
                        />
                        <button type='button' onClick={() => searchItem()}>
                            <BsSearch />
                        </button>
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
                                <td className='item-state-btn-box' style={{ height: '120px' }}>

                                    <Button
                                        variant='primary'
                                        className='items-state-visible'
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