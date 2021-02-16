var exports = module.exports={};
const Papa = require('papaparse');
const fs = require('fs');

const csvFileCats = fs.readFileSync('./CSVFiles/Movies/cats.csv') 
const csvCats = csvFileCats.toString() 
const csvDataCats = Papa.parse(csvCats, {header:true}).data

const csvFileProps = fs.readFileSync('./CSVFiles/Movies/props.csv') 
const csvProps = csvFileProps.toString() 
const csvDataProps = Papa.parse(csvProps, {header:true}).data

//Category similarity function
async function SimC (resource1, resource2){
    
    var categories1=[],categories2=[]  //Categories for each resource
    var F1=0,F2=0,F3=0  //Categories occurencies 
    console.time('====== catergoriesTime')
    //Split categories by resources
    await csvDataCats.filter(data => data.resource === resource1).map((movie)=>{
        categories1.push(movie.category)
    })
    await csvDataCats.filter(data => data.resource === resource2).map((movie)=>{
        categories2.push(movie.category)
    })

    categories1.map((c1)=>{ if(categories2.includes(c1)) F1=F1+1 })  //cat(r1) = cat(r2)
    categories1.map((c1)=>{ if(!categories2.includes(c1)) F2=F2+1 }) //cat(r1) - cat(r2)
    categories2.map((c2)=>{ if(!categories1.includes(c2)) F3=F3+1 }) //cat(r2) - cat(r1)

    const categorySimilarity = F1/(F1+F2+F3)
    console.timeEnd('====== catergoriesTime')
    return categorySimilarity
}

//Property similarity function
async function SimP (resource1, resource2){
    
    var movie1,movie2 //movie instences for each resource
    var movie1,movie2 //contains 1 if prop exists and 0 if not
    var F1=[],F2=[],F3=[]  //property occurencies tables
    var PIC1=0, PIC2=0, PIC3=0, Freq  
    const N = 10000 //Total of resources (in the csv file)

    try {

        console.time('====== propsTime')
        movie1 = await csvDataProps.filter(data => data.resource === resource1)[0]
        movie2 = await csvDataProps.filter(data => data.resource === resource2)[0]

        /*Supposetly : 
            F1 : props(movie1) = props(movie2),
            F2 : props(movie1) - props(movie2),
            F3 : props(movie2) - props(movie1)
        */

        if(movie1.title!=='none' && movie2.title!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.title!=='none' && movie2.title==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.title==='none' && movie2.title!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.tagline!=='none' && movie2.tagline!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.tagline!=='none' && movie2.tagline==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.tagline==='none' && movie2.tagline!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.overview!=='none' && movie2.overview!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.overview!=='none' && movie2.overview==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.overview==='none' && movie2.overview!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.production_companies!=='none' && movie2.production_companies!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.production_companies!=='none' && movie2.production_companies==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.production_companies==='none' && movie2.production_companies!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.release_date!=='none' && movie2.release_date!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.release_date!=='none' && movie2.release_date==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.release_date==='none' && movie2.release_date!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.genres!=='none' && movie2.genres!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.genres!=='none' && movie2.genres==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.genres==='none' && movie2.genres!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.spoken_languages!=='none' && movie2.spoken_languages!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.spoken_languages!=='none' && movie2.spoken_languages==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.spoken_languages==='none' && movie2.spoken_languages!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(movie1.runtime!=='none' && movie2.runtime!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(movie1.runtime!=='none' && movie2.runtime==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(movie1.runtime==='none' && movie2.runtime!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        //Frequencies and PICs calculations for each set (F1,F2 and F3)
        Freq = await getFrequency(F1)
        await Freq.map((freq)=>{ if(freq!==0) PIC1= PIC1-Math.log(freq/N) })

        Freq = await getFrequency(F2)
        await Freq.map((freq)=>{ if(freq!==0) PIC2= PIC2-Math.log(freq/N) })

        Freq = await getFrequency(F3)
        await Freq.map((freq)=>{ if(freq!==0) PIC3= PIC3-Math.log(freq/N) })

        var propertiesSimilaty = PIC1/(PIC1+PIC2+PIC3)

    }catch(err){
        console.log(err)
    }

    console.timeEnd('====== propsTime')
    return propertiesSimilaty
    }

async function getFrequency(resources){
    
    let frequencies=[0, 0, 0, 0, 0, 0, 0, 0]

    var properties = csvDataProps

    for(let i = 0;i<properties.length;i++){
        if(resources[0]===true) if(properties[i].title!=='none') frequencies[0] = frequencies[0] + 1
        if(resources[1]===true) if(properties[i].tagline!=='none') frequencies[1] = frequencies[1] + 1
        if(resources[2]===true) if(properties[i].overview!=='none') frequencies[2] = frequencies[2] + 1
        if(resources[3]===true) if(properties[i].production_companies!=='none') frequencies[3] = frequencies[3] + 1
        if(resources[4]===true) if(properties[i].release_date!=='none') frequencies[4] = frequencies[4] + 1
        if(resources[5]===true) if(properties[i].genres!=='none') frequencies[5] = frequencies[5] + 1
        if(resources[6]===true) if(properties[i].spoken_languages!=='none') frequencies[6] = frequencies[6] + 1
        if(resources[7]===true) if(properties[i].runtime!=='none') frequencies[7] = frequencies[7] + 1
       }
    
    return await frequencies
 }

 
//LODS similarity function
exports.LODS = async function (listFavURI, listExtURI){ 
    var mean //mean of similarity between two resources from the two lists
    var movieScores = [] //Objects containing the external movies and their similarity score with the favorite movies
    var score, extObjects = []

    listExtURI.map((movie)=>{ extObjects.push(movie) })

    for (let j = 0; j < extObjects.length; j++) {
        mean=0
        for (let i = 0; i < listFavURI.length; i++) {
                var simP = await (SimP(listFavURI[i],extObjects[j].uri).then(function(result) { return result }))
                var simC = await (SimC(listFavURI[i],extObjects[j].uri).then(function(result) { return result }))
                mean = mean + ((simP+simC+1)/3)
        }
        score = mean/listFavURI.length
        movieScores.push(
            {
                "resourceExt" : extObjects[j].uri,
                "id" : extObjects[j].id,
                "title": extObjects[j].title,
                "tagline": extObjects[j].tagline,
                "overview": extObjects[j].overview,
                "production_companies": extObjects[j].production_companies,
                "release_date": extObjects[j].release_date,
                "genres": extObjects[j].genres, 
                "spoken_languages": extObjects[j].spoken_languages, 
                "runtime": extObjects[j].runtime, 
                "poster_path": extObjects[j].poster_path,
                "homepage": extObjects[j].homepage,
                "provider": "TMDB",
                "vote_average": extObjects[j].vote_average,
                'score' : score || 0
            })
    }
    movieScores.sort(function(a, b){ if(a.score < b.score) return 1; else return -1 })
    return movieScores
}