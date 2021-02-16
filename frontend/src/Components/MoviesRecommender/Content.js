    import React  from 'react'
import './Welcome.scss'
import auth from 'solid-auth-client'
import { AuthButton} from '@solid/react';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import { errorToast} from '../Toast/ToastMethods'
import ReactTooltip from 'react-tooltip'
import { verifyAccess, webidToUri ,readInfoPerso, readRatedMovies, readSavedMovies, readMoviesGenresFile } from '../SolidMovies/Communication'
import { readRatedBooks, readSavedBooks, readGenresFile } from '../SolidBooks/Communication'
import loader from '../../Assets/oval.svg'
import axios from 'axios'
import './Welcome.scss'
import anonyme from '../../Assets/user.png'

                  
class Content extends React.Component {
    constructor(){
        super()
        this.state={
            profile:{},
            profileImage:'',
            moviesToRecommend:[],
            loading: true,
            loading2: false,
            userUri: '',
            genresLoading: true,
            preferedGenres: '',
            permissions: true,
            cnxError: false,
            calculationError: false
        }
    }
    async componentDidMount(){
        try {
            let session = await auth.currentSession()

            //Test connexion
            try {
                await auth.fetch(session.webId)
            }catch(err){
                this.setState({ cnxError: true })
                console.log("Connection error")
            }
       
           //Test prmissions
           let verif = await verifyAccess(session.webId)
           if (!verif) {
               this.setState({ permissions: false })
               errorToast('You must check the read option in access modes in your Solid pod')
               throw new Error('Not enough permissions')
           }
        
            //Read user infos from pod
            var uri = await webidToUri(session.webId)
            this.setState({ userUri: uri })
            var profile= await readInfoPerso(uri)
            this.setState({profile: profile, loading:false, loading2:true})
            window.localStorage.setItem("loginState", "connected")

            //Set image
            if(this.state.profile.image!=='none') this.setState({ profileImage: this.state.profile.image })
            else this.setState({ profileImage: anonyme })

            //Read user preferences

            //Read Genre movies
            var moviesGenres = await readMoviesGenresFile(uri)

            var gnrs = moviesGenres
            var jsonArrBooks = []
            var booksGenres = []
            let jsonArr1 = []
            let jsonArr2 = []

            try{
                //Read Genre books
                booksGenres = await readGenresFile(uri)

                //Read profile books    
                var books = await readRatedBooks(uri,0).then( (result)=>{ return result })
                let arr = books.split("%%")
                for (let index = 1; index < arr.length; index++) {
                    jsonArr1.push(JSON.parse(arr[index]))
                }

                var books2 = await readSavedBooks(uri).then( (result)=>{ return result })
                let arr2 = books2.split("%%")
                for (let index = 1; index < arr2.length; index++) {
                    jsonArr2.push(JSON.parse(arr2[index]))
                }

                jsonArrBooks = jsonArr1.concat(jsonArr2)

                gnrs = booksGenres

                await jsonArrBooks.map((book)=>{
                    if(book.literaryGenre.includes('http://dbpedia.org/resource/')) gnrs.push(book.literaryGenre.substring(28,book.literaryGenre.length-1));
                    else
                        if(book.literaryGenre !== '' && book.literaryGenre !== 'none' && book.literaryGenre !== ' ') gnrs.push(book.literaryGenre);
                }) 

            }catch(err){
                console.log('books error')
            }


            //Read profile movies 
            var movies = await readRatedMovies(uri,0).then( (result)=>{ return result })
            let arr = movies.split("%%")
            jsonArr1 = []
            for (let index = 1; index < arr.length; index++) {
                jsonArr1.push(JSON.parse(arr[index]))
            }

            var movies2 = await readSavedMovies(uri).then( (result)=>{ return result })
            let arr2 = movies2.split("%%")
            jsonArr2 = []
            for (let index = 1; index < arr2.length; index++) {
                jsonArr2.push(JSON.parse(arr2[index]))
            }

            let jsonArrMovies = jsonArr1.concat(jsonArr2)

            console.log("profile movies : ")
            console.log(jsonArrMovies)  

            gnrs = gnrs.concat(moviesGenres)
            
            await jsonArrMovies.map((movie)=>{
                if(movie.filmGenre !== '' && movie.filmGenre !== 'none' && movie.filmGenre !== ' ') gnrs.push(movie.filmGenre);
            }) 

            var gnrsSep = []
            gnrs.map((g)=>{
                gnrsSep = gnrsSep.concat(g.split(","))
            })

            gnrs=[]
            gnrsSep.map((g)=>{
                if(g!=='') gnrs.push(g)
            })

            var cleanGenres = await gnrs.filter((v,i) => gnrs.indexOf(v) === i)

            var gnrsStr = ''
            cleanGenres.map((g)=>{
                gnrsStr = gnrsStr + g.split('_').join(' ').toLowerCase() + ', '
            })
            gnrsStr = gnrsStr.substring(0,gnrsStr.length-2)
            this.setState({ preferedGenres: gnrsStr, genresLoading: false })

            var jsonRequest = {
                "profileBooks": jsonArrBooks,
                "profileMovies": jsonArrMovies,
                "genreBooks": booksGenres,
                "genreMovies": moviesGenres
            }

            //get recommendations from LODS Backend
            let ratingsArray = await axios
                                .post('http://localhost:3005/lods/movies', jsonRequest)
                                .then(res => {return res} )
                                .catch(err => {
                                    this.setState({ calculationError: true })
                                    console.error(err);
                                });   
            this.setState({ moviesToRecommend : ratingsArray.data.data, loading2: false })
            console.log(ratingsArray.data.data)

            //save movies in localStorage
            window.localStorage.setItem("moviesRecommended", JSON.stringify(ratingsArray.data.data))
        
        }
        catch(error){
            console.log(error)
        }
    }

    renderCard(){
        if(this.state.loading)
            return  (
                <div className="RS-userCard">
                    <img src={loader}/>
                </div>
            )
        else
            if(this.state.cnxError){
                return(
                    <div className="RS-userCard">
                        <div className="RS-profileContainer">
                            <p className="RS-cnxError">Connexion error, please reload the page</p>
                        </div>
                    </div>
                )
            }
            else
                return(
                    <div className="RS-userCard">
                        <ReactTooltip
                            id="allTooltip2"
                            className="RS-tooltip"
                            place={'bottom'}
                            type={'info'}
                            multiline={true}
                            effect={'float'}
                            textColor={'#eae7dc'}
                            backgroundColor={'#8e8d8a'}
                            delayShow={300}
                        />
                        <div className="RS-profileContainer">
                            
                            <a data-for="allTooltip2" data-tip="Your Solid pod informations" data-iscapture="true"> 
                                <img src={this.state.profileImage} className="RS-profileImage"/>
                                <h1 className="RS-profileName"> {this.state.profile.firstName} </h1>
                                <div className="RS-profileDesc">
                                    <p>User Name : <span>{this.state.profile.firstName}</span></p>
                                    <p>WebId : <span>{this.state.userUri}</span></p>
                                    <div>Prefered genres : 
                                    {
                                        this.state.genresLoading
                                        &&
                                        <div className='RS-preferedGenres'> In process...</div>
                                        ||
                                        !this.state.genresLoading
                                        &&
                                        <div className='RS-preferedGenres'>{this.state.preferedGenres}.</div>
                                    }
                                    </div>
                                </div> 
                            </a>

                            <a data-for="allTooltip2" data-tip="Log out from your Solid pod" data-iscapture="true"> 
                                <div className="RS-logoutArea">
                                    <p className="RS-logoutButton"><AuthButton  popup="popup.html"/></p>
                                </div>
                            </a>
                        </div>
                    </div>
                )
    }

    render(){
        if(!this.state.permissions) return <div className="RS-permissionsError">You must check read access modes option in your Solid pod</div>
        else
        return(
            <div>
                <ReactTooltip
                        id="allTooltip3"
                        className="RS-tooltip"
                        place={'bottom'}
                        type={'info'}
                        multiline={true}
                        effect={'float'}
                        textColor={'#eae7dc'}
                        backgroundColor={'#8e8d8a'}
                        delayShow={300}
                />
                {this.renderCard()}
                <a data-for="allTooltip2" data-tip="URIs of the mesured ressources" data-iscapture="true"> 
                    <div className="RS-terminal">
                        <div className="RS-terminalHeader">
                            <div id="RS-terminalTitle">Terminal - Recommender System Results</div>
                            <span>x</span>
                            <span>_</span>
                        </div>
                        <div className="RS-terminalBody">
                        {
                            this.state.loading2 && !this.state.cnxError && !this.state.calculationError && !this.state.genresLoading
                            &&
                            <div className="RS-textCover"></div>
                            ||
                            !this.state.loading2 && !this.state.calculationError
                            &&
                            this.state.moviesToRecommend.map(movie=>{
                                return <div key={movie.resourceExt}>{movie.resourceExt}</div>
                            })
                            ||
                            this.state.calculationError
                            &&
                            <p className="RS-calculationError">Error in calculation, please reload the page</p> 
                        }
                        </div>
                    </div>
                </a>
                <ToastContainer />
            </div>
        )
    }
}

export default Content;