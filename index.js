import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://quotes-39474-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const quoteListInDB = ref(database, "quoteList")

const insertBtn = document.getElementById("insert-btn")
const quoteInp = document.getElementById("quote-inp")
const authorInp = document.getElementById("author-inp")
const quoteList = document.getElementById("quote-list")

insertBtn.addEventListener("click", function(){
    if (authorInp.value.trim() !== '' && quoteInp.value.trim() !== ''){
        let author = authorInp.value
        let quote = quoteInp.value
        push(quoteListInDB,{author,quote})
        
        resetQuoteAndAuthor()
    }
})

onValue(quoteListInDB, function(snapshot){
    if (snapshot.exists()){
        let pairArray = Object.entries(snapshot.val())
        
        clearQuoteList()
        
        for(let i = 0; i < pairArray.length; i++){
            let currentPair = pairArray[i]
            let currentPairID = currentPair[0]
            let currentPairAuthor = currentPair[1].author
            let currentPairQuote = currentPair[1].quote
            
            addPairToQuoteList(currentPair)
            
        }
    }
    else{
        quoteList.innerHTML = "No Quote or Author inserted"
    }
})
function resetQuoteAndAuthor(){
    quoteInp.value = ""
    authorInp.value = ""
}

function clearQuoteList(){
    quoteList.innerHTML = ""
}

function addPairToQuoteList(pair){
    let pairID = pair[0]
    let author = pair[1].author
    let quote = pair[1].quote 
    
    let newLi = document.createElement("li")
    
    
    newLi.innerHTML = `<h1>${quote}</h1>-${author}`
    newLi.addEventListener("click", function(){
        let pairLocation = ref(database, `quoteList/${pairID}`)
        
        remove(pairLocation)
    })
    quoteList.append(newLi)
}


