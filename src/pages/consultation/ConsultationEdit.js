import React, { Component } from 'react';
import SideBar from '../../components/sidebar';
import NavigationBar from '../../components/navigationbar';
import Footer from '../../components/footer';
import ConsultationEditor from '../../components/consultation/ConsultationEditor';

export default class ConsultationEdit extends Component {
    render() {
        const { match } = this.props;
        const CONST_ID = match.params.CONST_ID;
    
        return (
            <div>
                <SideBar url={"/consultation/edit"}></SideBar>
                <div className="main-panel">
                    <NavigationBar></NavigationBar>
                    <div className="content">
                        <div className="container-fluid">
                            <ConsultationEditor CONST_ID={CONST_ID}></ConsultationEditor>
                        </div>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        );
    }
}