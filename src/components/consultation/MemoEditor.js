import React, { Component } from 'react'
import Swal from 'sweetalert2'
import moment from 'moment'
import MemoService from '../../services/memoService'

export default class MemoEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item:  {
                MEMO_ID: '',
                CONST_ID: '',
                WRTR_ID: 'USER',
                DATE_MEMO: new Date().toISOString(),
                MEMO: ''
            },
        }

        this._inputDateRef = React.createRef();
    }

    componentDidMount() {
        const {memoInfo} = this.props;

        if(memoInfo) {
            const newState = {
                ...this.state,
                item : memoInfo
            }
            this.setState(newState);
        } else {
            const newState = {
                ...this.state,
                item : {
                    ...this.state.item,
                    CONST_ID: this.props.CONST_ID
                }
            }

            this.setState(newState);
        }

        window.$('.datetimepicker').datetimepicker({
            format: 'YYYY/MM/DD h:mm A',
            icons: {
              time: "fa fa-clock-o",
              date: "fa fa-calendar",
              up: "fa fa-chevron-up",
              down: "fa fa-chevron-down",
              previous: 'fa fa-chevron-left',
              next: 'fa fa-chevron-right',
              today: 'fa fa-screenshot',
              clear: 'fa fa-trash',
              close: 'fa fa-remove'
            }
        });
    }

    _onClickRegister = (e) => {
        Swal.queue([{
            title: '메모 등록',
            confirmButtonText: '등록',
            text: '메모를 등록 하시겠습니까?',
            showLoaderOnConfirm: true,
            type: 'warning',
            preConfirm: () => {
                if(!!this.state.item.MEMO_ID) {
                    return MemoService.update({
                        ...this.state.item,
                        [this._inputDateRef.current.name]: new Date(this._inputDateRef.current.value).toISOString()
                    }).then(({data: {updateMemo : {MEMO_ID}}}) => {
                            Swal.insertQueueStep({
                                title: '성공!',
                                text: `메모 ID: ${MEMO_ID}`,
                                buttonsStyling: false,
                                confirmButtonClass: 'btn btn-success',
                                type: 'success',
                                preConfirm: () => {
                                    // window.location.replace(`/consultation/${MEMO_ID}`);
                                }
                            });
                        }, (error) => {
                            Swal.insertQueueStep({
                                title: '에러!',
                                text: '상담 정보 업데이트가 실패 하였습니다.',
                                type: 'error',
                            });
                        });
                } else {
                    return MemoService.create({
                        ...this.state.item,
                        [this._inputDateRef.current.name]: new Date(this._inputDateRef.current.value).toISOString()
                    }).then(({data: {createMemo : {MEMO_ID}}})=> {
                        Swal.insertQueueStep({
                            title: '성공!',
                            text: `메모 ID: ${MEMO_ID}`,
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-success',
                            type: 'success',
                            preConfirm: () => {
                                // window.location.replace(`/consultation/${MEMO_ID}`);
                                window.location.reload();
                            }
                        });
                    }, (error)=> {
                        Swal.insertQueueStep({
                            title: '에러!',
                            text: '메모 등록이 실패 하였습니다.',
                            type: 'error',
                        });
                    })
                }
            }
          }]);
    }

    _onChangeHandler = (e) => {
        const newState = {
            ...this.state,
            item : {
                ...this.state.item,
                [this._inputDateRef.current.name]: this._inputDateRef.current.value,
            }
        }

        newState.item[e.target.name] = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

        this.setState(newState);
    };

    _onClickDelete = () => {
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
                return MemoService.delete({
                    MEMO_ID: this.state.item.MEMO_ID
                }).then(({ data: { deleteMemo: { MEMO_ID } } }) => {
                    Swal.insertQueueStep({
                        title: '성공!',
                        text: `상담 ID: ${MEMO_ID}가 삭제되었습니다.`,
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
                        text: '메모 삭제가 실패 하였습니다.',
                        type: 'error',
                    });
                })
            }
        }]);
    }

    render() {
        return (
            <form action="" method="">
                <div className="card ">
                    <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                            <i className="material-icons">message</i>
                        </div>
                        <h4 className="card-title">
                            {this.state.item.MEMO_ID ? '기존 메모' : '신규 메모'}
                        </h4>
                    </div>
                    <div className="card-body">
                        {this.state.item.MEMO_ID ? 
                            (<div className="row">
                                <label className="col-sm-3 col-form-label">메모 ID</label>
                                <div className="col-sm-8">
                                    <div className="form-group bmd-form-group">
                                        <input className="form-control" type="text" name="MEMO_ID" aria-required="true" disabled value={this.state.item.MEMO_ID} onChange={this._onChangeHandler}/>
                                    </div>
                                </div>
                            </div>) : null
                        }
                        <div className="row">
                            <label className="col-sm-3 col-form-label">작성자 ID</label>
                            <div className="col-sm-8">
                                <div className="form-group bmd-form-group">
                                    <input className="form-control" type="text" name="WRTR_ID" aria-required="true" disabled value={this.state.item.WRTR_ID} onChange={this._onChangeHandler}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <label className="col-sm-3 col-form-label">상담 시간</label>
                            <div className="col-sm-8">
                                <div className="form-group bmd-form-group is-filled">
                                    <input className="form-control datetimepicker" type="text" name="DATE_MEMO" required={true} value={moment(this.state.item.DATE_MEMO).format("YYYY/MM/DD h:mm A")} onChange={this._onChangeHandler} ref={this._inputDateRef}/>
                                    <span className="material-input"></span>
                                    <span className="material-input"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <label className="col-sm-3 col-form-label">상담 내용</label>
                            <div className="col-sm-8">
                                <div className="form-group bmd-form-group">
                                    <textarea className="form-control" rows="5" name="CONTENT" value={this.state.item.CONTENT} onChange={this._onChangeHandler}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer text-right">
                        <div className="form-check mr-auto"></div>
                        {this.state.item.MEMO_ID ? <button type="button" className="btn btn-outline-rose" onClick={this._onClickDelete}>삭제</button> : null}
                        <button type="button" className="btn btn-warning" onClick={this._onClickRegister} onChange={this._onChangeHandler}>등록</button>
                    </div>
                </div>
            </form>
        );
    }
}