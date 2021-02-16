import React  from 'react'
import './Welcome.scss'
import auth from 'solid-auth-client'
import { AuthButton,Value} from '@solid/react';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { errorToast } from '../Toast/ToastMethods'
import {verifyAccess} from '../SolidMovies/Communication'
import ReactTooltip from 'react-tooltip'
import axios from 'axios'
import Content from './Content'
var CrossStorageHub = require('cross-storage').CrossStorageHub;

                  
class MoviesRecommender extends React.Component {
    state = { 
        loggedIn : false,
        loading: true,
        profile:{},
        verification: true
    };

    interval = setInterval(async () => {
        let session = await auth.currentSession()
        if(session!==null) {
            this.setState({loggedIn:true})
            let verif = await verifyAccess(session.webId)
            if (!verif) {
                this.setState({ verification:false })
                errorToast('You must check the read access modes option in your Solid pod')
                //throw new Error('Not enough permissions')
            }
            else this.setState({ verification:true })
        }
        else {
            this.setState({loggedIn:false})
            window.localStorage.setItem("loginState", "")
        }
    }, 1000);

    async componentDidMount(){
        CrossStorageHub.init([
            {origin: /localhost:3000$/, allow: ['get', 'set', 'del', 'getKeys', 'clear']},
            {origin: /localhost:3010$/, allow: ['get', 'set', 'del', 'getKeys', 'clear']}
        ]);
       
    }
    
    renderCard(){
        return  (
            <Content />
        )
    }
    render() {
            return (
                <div className="RS-wrapper">
                    <ReactTooltip
                        id="allTooltip"
                        className="RS-tooltip"
                        place={'bottom'}
                        type={'info'}
                        multiline={true}
                        effect={'float'}
                        textColor={'#eae7dc'}
                        backgroundColor={'#8e8d8a'}
                        delayShow={300}
                    />
                    <div className="RS-rsInfos">
                        <h3 className="RS-rsTitle">
                            LODS Recommender System
                            <span> ______________________________________________________________________________</span>
                        </h3>
                        <div className="RS-rsDesc"> 
                            The LODS Recommender System operates on ressources using a similarity measure that combines multiple 
                            sub-measures. This measure is called The <i>Linked Open Data Similarity measure</i> (LODS). 
                            It compares ressources according to their semantic informations (Linked Open Data) extracted from 
                            the <a href="https://lod-cloud.net/#diagram" target ="__blank">DBpedia Data Cloud</a>. <br/><br/>
                            The <i>Linked Open Data Similarity measure</i> harmonics three sub-measures which are : <br/>
                            <div className="RS-similarities">
                                <span className="RS-mesureIndex">(1)</span> The <i>Concepts-based similarity measure</i>.<br/>
                                <span className="RS-mesureIndex">(2)</span> The <i>Properties-based similarity measure</i>. <br/>
                                <span className="RS-mesureIndex">(3)</span> The <i>Categories-based similarity measure</i>.<br/>
                            </div>
                        </div>
                        <span className="RS-link">
                            Click <a href="https://ieeexplore.ieee.org/abstract/document/7536467" target="__blank">here</a> and check the article to learn more about this topic.<br/>
                            <span>___________________________________________________________________________________________________________________________________________________________________________________</span>
                        </span>
                    </div>

                    {
                        !this.state.loggedIn
                        &&
                        <div className="RS-loginForm">
                            <div>
                                <p className="RS-loginText">Please Login to your pod  :</p>
                            </div>
                            <div>
                                <a data-for="allTooltip" data-tip="Log in to your Solid pod" data-iscapture="true">
                                    <p className="RS-loginButton">
                                        <AuthButton popup="http://localhost:5000/popup.html"/>
                                    </p>
                                </a>
                            </div>
                        </div>
                    }
                    {
                        this.state.loggedIn && this.state.verification
                        &&
                        this.renderCard()
                    }
                   
                </div>
            );
        }
    }

export default MoviesRecommender