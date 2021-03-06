import moment from 'moment';
import React, { Component } from 'react';
import Swal from 'sweetalert2'
import ConsultService from '../../services/consultService';
import { Row, Col, Modal, Button, Table } from 'react-bootstrap';
import PhoneNumber from '../../utils/PhoneNumber';

export default class ConsultationSearchModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            limit: 5,
            edges: [],
            pageInfo: {
                endCursor: null,
                startCursor: null,
                hasPreviousPage: false
            },
            searchText: '',
            show: false,
        }
    }

    onClickCHandler = (e) => {
        e.preventDefault();

        const elemTarget = e.target;
        

        if (elemTarget && elemTarget.dataset.action === 'onPrevPage') {
            this.onPrevPage(e);
        } else if (elemTarget && elemTarget.dataset.action === 'onNextPage') {
            this.onNextPage(e);
        } else if (elemTarget && elemTarget.dataset.action === 'onSearch') {
            this.onSearch(e);
        } else {
            if(this.props.onSuccess) {
                this.closeModal();

                const CONST_ID = parseInt(e.currentTarget.dataset.id, 10);

                const targetConsultation = this.state.edges.find((edge) => {
                    return edge.CONST_ID === CONST_ID;
                });

                this.props.onSuccess(targetConsultation);
            }
        }
    }

    onChangeHandler = (e) => {
        this.setState({
            searchText: e.target.value
        });
    }

    onPrevPage = (e) => {
        const startCursor = this.state.pageInfo.startCursor;

        if(!!this.state.searchText) {
            ConsultService.search({
                first: this.state.limit,
                filter: {
                    DATE: {
                        contains: this.state.searchText
                    },
                    WRT_DATE: {
                        contains: this.state.searchText
                    },
                    EE_ID: {
                        contains: this.state.searchText
                    },
                    C_TEL: {
                        contains: this.state.searchText
                    },
                    MEMO: {
                        contains: this.state.searchText
                    },
                    P_SUBSIDY_AMT: {
                        contains: this.state.searchText
                    },
                }
            })
            .then(({ data: { searchConsultation: ConsultationConnection } }) => {
                this.setState({
                    edges: ConsultationConnection.edges,
                    pageInfo: ConsultationConnection.pageInfo,
                    limit: this.state.limit,
                    loading: false
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '상담 정보 검색을 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            });
        } else {
            ConsultService.read({
                last: this.state.limit,
                before: startCursor
            }).then(({ data: { readConsultation: ConsultationConnection } }) => {
                if(ConsultationConnection.edges.length < 1) {
                    return Swal.fire({
                        title: '에러!',
                        text: '처음 페이지 입니다.',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-success',
                        type: 'error'
                    });
                }
    
                this.setState({
                    edges: ConsultationConnection.edges,
                    pageInfo: ConsultationConnection.pageInfo,
                    limit: this.state.limit,
                    loading: true
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '상담 정보 조회를 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            }).finally(() => {
                this.setState({
                    loading: false
                });
            });
        }
    }

    onNextPage = () => {
        const endCursor = this.state.pageInfo.endCursor;

        if(this.state.edges.length < this.state.limit) {
            return Swal.fire({
                title: '에러!',
                text: '마지막 페이지 입니다.',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success',
                type: 'error'
            });
        }

        this.setState({
            loading: true
        });

        if(!!this.state.searchText) {
            ConsultService.search({
                first: this.state.limit,
                after: endCursor,
                filter: {
                    DATE: {
                        contains: this.state.searchText
                    },
                    WRT_DATE: {
                        contains: this.state.searchText
                    },
                    EE_ID: {
                        contains: this.state.searchText
                    },
                    C_TEL: {
                        contains: this.state.searchText
                    },
                    MEMO: {
                        contains: this.state.searchText
                    },
                    P_SUBSIDY_AMT: {
                        contains: this.state.searchText
                    },
                }
            })
            .then(({ data: { searchConsultation: ConsultationConnection } }) => {
                this.setState({
                    edges: ConsultationConnection.edges,
                    pageInfo: ConsultationConnection.pageInfo,
                    limit: this.state.limit,
                    loading: false
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '상담 정보 검색을 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            });
        } else {
            ConsultService.read({
                first: this.state.limit,
                after: endCursor
            }).then(({ data: { readConsultation: ConsultationConnection } }) => {
                if(ConsultationConnection.edges.length < 1) {

                    return Swal.fire({
                        title: '에러!',
                        text: '마지막 페이지 입니다.',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-success',
                        type: 'error'
                    });
                }

                this.setState({
                    edges: ConsultationConnection.edges,
                    pageInfo: ConsultationConnection.pageInfo,
                    limit: this.state.limit,
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '상담 정보 조회를 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            }).finally(() => {
                this.setState({
                    loading: false
                });
            });
        }
    }

    onSearch = (e) => {
        ConsultService.search({
            first: this.state.limit,
            filter: {
                DATE: {
                    contains: this.state.searchText
                },
                WRT_DATE: {
                    contains: this.state.searchText
                },
                EE_ID: {
                    contains: this.state.searchText
                },
                C_TEL: {
                    contains: this.state.searchText
                },
                P_SUBSIDY_AMT: {
                    contains: this.state.searchText
                },
            }
        })
        .then(({ data: { searchConsultation: ConsultationConnection } }) => {
            this.setState({
                edges: ConsultationConnection.edges,
                pageInfo: ConsultationConnection.pageInfo,
                limit: this.state.limit,
                loading: false
            });
        }, (err) => {
            Swal.fire({
                title: '에러!',
                text: '상담 정보 검색을 실패 하였습니다.',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success',
                type: 'error'
            });
        });
    }

    onKeyDownHandler = (e) => {
        if(e.keyCode === 13) {
            this.onSearch();
        }
    }

    renderItems = () => {
        return this.state.edges.map((Consultation) => (
            <tr key={Consultation.CONST_ID} onClick={this.onClickCHandler} data-id={Consultation.CONST_ID}>
                <td className="text-center">{Consultation.CONST_ID}</td>
                <td className="text-center">{PhoneNumber(Consultation.C_TEL) || '미등록'}</td>
                <td className="text-center">{Consultation.DATE_REG ? moment(Consultation.DATE_REG).format("YYYY/MM/DD h:mm A") : '미등록'}</td>
            </tr>
        ));
    }

    openModal = () => {
        this.setState({ show: true });
    }

    closeModal = () => {
        this.setState({ show: false });
    }

    _onShow = () => {
        const { searchText } = this.props;
        
        this.setState({
            ...this.state,
            searchText
        });

        ConsultService.search({
            first: this.state.limit,
            filter: {
                DATE: {
                    contains: searchText
                },
                WRT_DATE: {
                    contains: searchText
                },
                EE_ID: {
                    contains: searchText
                },
                C_TEL: {
                    contains: searchText
                },
                P_SUBSIDY_AMT: {
                    contains: searchText
                },
            }
        })
        .then(({ data: { searchConsultation: ConsultationConnection } }) => {
            this.setState({
                edges: ConsultationConnection.edges,
                pageInfo: ConsultationConnection.pageInfo,
                limit: this.state.limit,
                loading: false
            });
        }, (err) => {
            Swal.fire({
                title: '에러!',
                text: '상담 정보 검색을 실패 하였습니다.',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-success',
                type: 'error'
            });
        });
    }

    _onHide = () => {
        this.setState({show: false});
    }

    render() {
        return (
            <>
            <Button size='sm' type="button" className="btn btn-rose btn-sm btn-round" onClick={() => this.setState({show: true})}>
                <i className="material-icons">search</i>
                찾기
            </Button>
            <Modal show={this.state.show} onHide={this._onHide} onShow={this._onShow} size='lg' aria-labelledby="constSearchModalLabel">
                <div className="modal-content">
                    <Modal.Header closeButton>
                        <Modal.Title>상담내역 검색</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="form-group bmd-form-group">
                            <div className="col-5 ml-auto">
                                <Row>
                                    <div className="col-7">
                                        <input className="form-control" type="text" name="CONST_ID" aria-required="true" autoComplete="false" value={this.state.searchText} onChange={this.onChangeHandler} onKeyDown={this.onKeyDownHandler}/>
                                    </div>
                                    <div className="col ml-auto">
                                        <button type="button" className="btn btn-rose btn-sm btn-round" onClick={this.onClickCHandler} data-action="onSearch">
                                            <i className="material-icons">search</i>
                                            찾기
                                        </button>
                                    </div>
                                </Row>
                            </div>
                        </Row>
                        <Row>
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th className="text-center">상담 순서</th>
                                        <th className="text-center">고객 전화 번호</th>
                                        <th className="text-center">등록 시각</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderItems()}
                                </tbody>
                            </Table>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Col className="ml-auto">
                                <div className="dataTables_paginate paging_full_numbers" onClick={this.onClickCHandler}>
                                    <ul className="pagination">
                                        <li className="paginate_button page-item previous">
                                            <a href="#Prev" aria-controls="datatables" className="page-link" data-action="onPrevPage">
                                                Prev
                                            </a>
                                        </li>
                                        <li className="paginate_button page-item next">
                                            <a href="#Next" aria-controls="datatables" className="page-link" data-action="onNextPage">
                                                Next
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </div>
            </Modal>
            </>
        );
    }
}