var exports = module.exports={};
const Papa = require('papaparse');
const fs = require('fs');

const csvFileCats = fs.readFileSync('./CSVFiles/Books/cats.csv') 
const csvCats = csvFileCats.toString() 
const csvDataCats = Papa.parse(csvCats, {header:true}).data

const csvFileProps = fs.readFileSync('./CSVFiles/Books/props.csv') 
const csvProps = csvFileProps.toString() 
const csvDataProps = Papa.parse(csvProps, {header:true}).data

//Category similarity function
async function SimC (resource1, resource2){
    
    var categories1=[],categories2=[]  //Categories for each resource
    var F1=0,F2=0,F3=0  //Categories occurencies 
    console.time('====== catergoriesTime')
    //Split categories by resources
    await csvDataCats.filter(data => data.resource === resource1).map((book)=>{
        categories1.push(book.category)
    })
    await csvDataCats.filter(data => data.resource === resource2).map((book)=>{
        categories2.push(book.category)
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
    
    var book1,book2 //book instences for each resource
    var book1,book2 //contains 1 if prop exists and 0 if not
    var F1=[],F2=[],F3=[]  //property occurencies tables
    var PIC1=0, PIC2=0, PIC3=0, Freq  
    const N = 10000 //Total of resources (in the csv file)

    try {

        console.time('====== propsTime')
        book1 = await csvDataProps.filter(data => data.resource === resource1)[0]
        book2 = await csvDataProps.filter(data => data.resource === resource2)[0]

        /*Supposetly : 
            F1 : props(book1) = props(book2),
            F2 : props(book1) - props(book2),
            F3 : props(book2) - props(book1)
        */

        if(book1.title!=='none' && book2.title!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(book1.title!=='none' && book2.title==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(book1.title==='none' && book2.title!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(book1.author!=='none' && book2.author!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(book1.author!=='none' && book2.author==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(book1.author==='none' && book2.author!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(book1.publisher!=='none' && book2.publisher!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(book1.publisher!=='none' && book2.publisher==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(book1.publisher==='none' && book2.publisher!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(book1.genre!=='none' && book2.genre!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(book1.genre!=='none' && book2.genre==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(book1.genre==='none' && book2.genre!=='none') {
                    F1.push(false)
                    F2.push(false)
                    F3.push(true)
                }

        if(book1.country!=='none' && book2.country!=='none')
        { 
            F1.push(true)
            F2.push(false)
            F3.push(false)
        }
        else 
            if(book1.country!=='none' && book2.country==='none') {
                F1.push(false)
                F2.push(true)
                F3.push(false)
            }
            else 
                if(book1.country==='none' && book2.country!=='none') {
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
    
    let frequencies=[0, 0, 0, 0, 0]

    var properties = csvDataProps

    for(let i = 0;i<properties.length;i++){
        if(resources[0]===true) if(properties[i].title!=='none') frequencies[0] = frequencies[0] + 1
        if(resources[1]===true) if(properties[i].author!=='none') frequencies[1] = frequencies[1] + 1
        if(resources[2]===true) if(properties[i].publisher!=='none') frequencies[2] = frequencies[2] + 1
        if(resources[3]===true) if(properties[i].genre!=='none') frequencies[3] = frequencies[3] + 1
        if(resources[4]===true) if(properties[i].country!=='none') frequencies[4] = frequencies[4] + 1
       }
    
    return await frequencies
 }


//LODS similarity function
exports.LODS = async function (listFavURI, listExtURI, recommenders=[true, false, false]){ 
    var mean //mean of similarity between two resources from the two lists
    var bookScores = [] //Objects containing the external books and their similarity score with the favorite books
    var score, extObjects = []

    listExtURI.map((book)=>{ extObjects.push(book) })

    for (let j = 0; j < extObjects.length; j++) {
        mean=0
        for (let i = 0; i < listFavURI.length; i++) {
            //LODS
            if(recommenders[0]) {
                var simP = await (SimP(listFavURI[i],extObjects[j].uri).then(function(result) { return result }))
                var simC = await (SimC(listFavURI[i],extObjects[j].uri).then(function(result) { return result }))
                mean = mean + ((simP+simC+1)/3)
            }
            else{
                if(recommenders[1]) {
                    var simC = await (SimC(listFavURI[i],extObjects[j].uri).then(function(result) { return result }))
                    mean = mean + simC
                }
                else{
                    if(recommenders[2]) {
                        var simP = await (SimP(listFavURI[i],extObjects[j].uri).then(function(result) { return result }))
                        mean = mean + simP
                    }
                }
            }
        }
        score = mean/listFavURI.length
        bookScores.push(
            {
                'resourceExt' : extObjects[j].uri,
                "id" : extObjects[j].id,
                "isbn13": extObjects[j].isbn13,
                "title": extObjects[j].title, 
                "subtitle": extObjects[j].subtitle,
                "abstract": extObjects[j].abstract,
                "authors": extObjects[j].authors,
                "publisher": extObjects[j].publisher,
                "published": extObjects[j].published, 
                "genres": extObjects[j].genres,
                "language": extObjects[j].language,
                "pages": extObjects[j].pages,
                "image": extObjects[j].image,
                "link": extObjects[j].link,
                "provider": extObjects[j].provider,
                "rating": extObjects[j].rating,
                "country": extObjects[j].country,
                "series": extObjects[j].series,
                'score' : score 
            })
    }
    bookScores.sort(function(a, b){ if(a.score < b.score) return 1; else return -1 })
    return bookScores
}