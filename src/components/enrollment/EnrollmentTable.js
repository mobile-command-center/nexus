import React, { Component } from 'react';
import Swal from 'sweetalert2'
import moment from 'moment';
import enrollService from '../../services/enrollService';
import LoadingSpinner from '../common/LoadingSpinner';

const styles = {
    table: {
        width: '100%'
    }
};

export default class EnrollmentTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            limit: 10,
            edges: [],
            pageInfo: {
                endCursor: null,
                startCursor: null,
                hasPreviousPage: false
            },
            loading: true,
            searchText: this.props.searchText || '',
        }
    }

    componentDidMount() {
        if(!!this.state.searchText) {
            enrollService.search({
                first: this.state.limit,
                filter: {
                    DATE: {
                        contains: this.state.searchText
                    },
                    EE_ID: {
                        contains: this.state.searchText
                    },
                    CPAN: {
                        contains: this.state.searchText
                    },
                    PROD: {
                        contains: this.state.searchText
                    },
                    ST: {
                        contains: this.state.searchText
                    },
                }
            })
            .then(({ data: { searchEnrollment: EnrollmentConnection } }) => {
                this.setState({
                    edges: EnrollmentConnection.edges,
                    pageInfo: EnrollmentConnection.pageInfo,
                    limit: this.state.limit,
                    loading: false
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '접수 정보 검색을 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            });
        } else {
            enrollService.read({
                first: this.state.limit
            })
            .then(({ data: { readEnrollment: EnrollmentConnection } }) => {
                this.setState({
                    edges: EnrollmentConnection.edges,
                    pageInfo: EnrollmentConnection.pageInfo,
                    limit: this.state.limit,
                    loading: false
                });
            }, () => {
                this.setState({
                    loading: false
                });
                Swal.fire({
                    title: '에러!',
                    text: '접수 정보 조회를 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            });
        }
    }

    renderItems = () => {
        return this.state.edges.map((Enrollment) => (
            <tr key={Enrollment.EL_ID} onClick={this.onClickCHandler} data-id={Enrollment.EL_ID}>
                <td className="text-center">{Enrollment.EL_ID}</td>
                <td className="text-center" data-action="onEditConsultation">{Enrollment.CONST_ID || '미등록'}</td>
                <td className="text-center" data-action="onEditApplication">{Enrollment.APL_ID || '미등록'}</td>
                <td>{Enrollment.EE_ID || '미등록'}</td>
                <td>{Enrollment.CPAN || '미등록'}</td>
                <td>{Enrollment.PROD || '미등록'}</td>
                <td>{Enrollment.ST || '미등록'}</td>
                <td>{Enrollment.DATE ? moment(Enrollment.DATE).format("YYYY/MM/DD h:mm A") : '미등록'}</td>
                <td className="text-right">
                    <a href="#12" className="btn btn-link btn-warning btn-just-icon edit"><i className="material-icons" data-action="onEdit">edit</i></a>
                    <a href="#34" className="btn btn-link btn-danger btn-just-icon remove"><i className="material-icons" data-action="onDelete">delete</i></a>
                </td>
            </tr>
        ));
    }

    onChangeHandler = (e) => {
        this.setState({
            searchText: e.target.value
        });
    }

    onKeyDownHandler = (e) => {
        if(e.keyCode === 13) {
            this.onSearch();
        }
    }

    onClickCHandler = (e) => {
        e.preventDefault();

        const elemTarget = e.target;
        const EL_ID = e.currentTarget.dataset.id;
        if (elemTarget && elemTarget.dataset.action === 'onEdit') {
            window.location.href = `../enrollment/edit/${EL_ID}`;
        } else if (elemTarget && elemTarget.dataset.action === 'onDelete') {
            this.onDelete(EL_ID);
        } else if (elemTarget && elemTarget.dataset.action === 'onPrevPage') {
            this.onPrevPage();
        } else if (elemTarget && elemTarget.dataset.action === 'onNextPage') {
            this.onNextPage();
        } else if (elemTarget && elemTarget.dataset.action === 'onSearch') {
            this.onSearch();
        } else if (elemTarget && elemTarget.dataset.action === 'onEditApplication') {
            const AL_ID = e.target.textContent;
            const win = window.open(`/application/edit/${AL_ID}`, '_blank');
            win.focus();
        } else if (elemTarget && elemTarget.dataset.action === 'onEditConsultation') {
            const CONST_ID = e.target.textContent;
            const win = window.open(`/consultation/edit/${CONST_ID}`, '_blank');
            win.focus();
        }
    }

    onSearch = (e) => {
        window.location.href = `/consultation/search/${this.state.searchText}`;
    }

    onPrevPage = (e) => {
        const startCursor = this.state.pageInfo.startCursor;

        if(!!this.state.searchText) {
            enrollService.search({
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
            .then(({ data: { searchEnrollment: EnrollmentConnection } }) => {
                this.setState({
                    edges: EnrollmentConnection.edges,
                    pageInfo: EnrollmentConnection.pageInfo,
                    limit: this.state.limit,
                    loading: false
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '접수 정보 검색을 실패 하였습니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            });
        } else {
            enrollService.read({
                last: this.state.limit,
                before: startCursor
            }).then(({ data: { readEnrollment: EnrollmentConnection } }) => {
                if(EnrollmentConnection.edges.length < 1) {
                    return Swal.fire({
                        title: '에러!',
                        text: '처음 페이지 입니다.',
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-success',
                        type: 'error'
                    });
                }
    
                this.setState({
                    edges: EnrollmentConnection.edges,
                    pageInfo: EnrollmentConnection.pageInfo,
                    limit: this.state.limit,
                    loading: true
                });
            }, (err) => {
                Swal.fire({
                    title: '에러!',
                    text: '접수 정보 조회를 실패 하였습니다.',
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

        enrollService.read({
            first: this.state.limit,
            after: endCursor
        }).then(({ data: { readEnrollment: EnrollmentConnection } }) => {
            if(EnrollmentConnection.edges.length < 1) {

                return Swal.fire({
                    title: '에러!',
                    text: '마지막 페이지 입니다.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success',
                    type: 'error'
                });
            }

            this.setState({
                edges: EnrollmentConnection.edges,
                pageInfo: EnrollmentConnection.pageInfo,
                limit: this.state.limit,
            });
        }, (err) => {
            Swal.fire({
                title: '에러!',
                text: '접수 정보 조회를 실패 하였습니다.',
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

    onDelete = (EL_ID) => {
        Swal.queue([{
            title: '삭제하시겠습니까?',
            confirmButtonText: '예, 삭제하겠습니다.',
            cancelButtonText: '아니오',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            text: '한 번 삭제 하시면 복구하실 수 없습니다.',
            showLoaderOnConfirm: true,
            type: 'warning',
            preConfirm: () => {
                return enrollService.delete({
                    EL_ID
                }).then(({ data: { deleteEnrollment: { EL_ID } } }) => {
                    Swal.insertQueueStep({
                        title: '성공!',
                        text: `접수 ID: ${EL_ID}가 삭제되었습니다.`,
                        buttonsStyling: false,
                        confirmButtonClass: 'btn btn-success',
                        type: 'success',
                        preConfirm: () => {
                            window.location.reload();
                        }
                    });
                }, (error) => {
                    Swal.insertQueueStep({
                        title: '에러!',
                        text: '접수 정보 삭제가 실패 하였습니다.',
                        type: 'error',
                    });
                })
            }
        }]);
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        {this.state.loading ? <LoadingSpinner></LoadingSpinner>:null}
                        <div className="card">
                            <div className="card-header card-header-rose card-header-icon">
                                <div className="card-icon">
                                    <i className="material-icons">how_to_reg</i>
                                </div>
                                <h4 className="card-title">접수 내역</h4>
                            </div>
                            <div className="card-body">
                                <div className="material-datatables">
                                    <div className="dataTables_wrapper dt-bootstrap4">
                                        <div className="row">
                                            {/* <div className="col-sm-12 col-md-6">
                                                <div className="dataTables_length" id="datatables_length">
                                                    <label>
                                                        Show 
                                                        <select name="datatables_length" aria-controls="datatables" className="custom-select custom-select-sm form-control form-control-sm">
                                                            <option value="10">10</option>
                                                            <option value="25">25</option>
                                                            <option value="50">50</option>
                                                            <option value="-1">All</option>
                                                        </select>
                                                        entries
                                                    </label>
                                                </div>
                                            </div> */}
                                            <div className="col-sm-12 col-md-6 ml-auto">
                                                <div id="datatables_filter" className="dataTables_filter">
                                                    <label>
                                                        <span className="bmd-form-group bmd-form-group-sm">
                                                            <input type="search" className="form-control form-control-sm" placeholder="Search records" aria-controls="datatables" value={this.state.searchText} onChange={this.onChangeHandler} onKeyDown={this.onKeyDownHandler}/>
                                                            <a href="#34" className="btn btn-rose btn-link btn-just-icon" onClick={this.onClickCHandler} ><i className="material-icons" data-action="onSearch">search</i></a>
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <table id="datatables" className="table table-striped table-no-bordered table-hover" cellSpacing="0" width="100%" style={styles.table}>
                                                <thead>
                                                    <tr>
                                                    <th className="text-center">접수 ID</th>
                                                    <th className="text-center">상담 ID</th>
                                                    <th className="text-center">신청서 ID</th>
                                                    <th>접수 직원 ID</th>
                                                    <th>접수 회사</th>
                                                    <th>접수 상품</th>
                                                    <th>상태</th>
                                                    <th>접수 날짜</th>
                                                    <th className="disabled-sorting text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tfoot>
                                                    <tr>
                                                    <th className="text-center">EL_ID</th>
                                                    <th className="text-center">CONST_ID</th>
                                                    <th className="text-center">APL_ID</th>
                                                    <th>EE_ID</th>
                                                    <th>CPAN</th>
                                                    <th>PROD</th>
                                                    <th>ST</th>
                                                    <th>DATE</th>
                                                    <th></th>
                                                    </tr>
                                                </tfoot>
                                                <tbody>
                                                    {this.renderItems()}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row">
                                        <div className="col-sm-12 col-md-1 ml-auto">
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
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}