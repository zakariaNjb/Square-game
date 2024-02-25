// Number of raws and columns
const RAW=7
const COLUMN=7
// Total score
let score=0
// Counter
let min=1
let second=59

// Create items and append them in the main element
const main=document.querySelector("main")
window.onload=(e)=>{
    const colors=["red","yellow","orange","blue","green","purple","chartreuse","aqua"]
    const texts=["R","Y","O","B","G","P","C","A"]

    for(i=0;i<RAW;i++){
        for(j=0;j<COLUMN;j++){
            const div=document.createElement("div")
            const index=Math.floor(Math.random() * colors.length);
            div.setAttribute("data-raw",i)
            div.setAttribute("data-column",j)
            div.setAttribute("draggable","true")
            div.setAttribute("class","item")
            div.style.backgroundColor=colors[index]
            div.innerText=texts[index]
            main.append(div)
        }  
    }
}

// Change the background color and text content between two items
function changeAttributes(item1,item2){
    const color=item2.style.backgroundColor
    const text=item2.innerText
    item2.style.backgroundColor=item1.style.backgroundColor
    item2.innerText=item1.innerText
    item1.style.backgroundColor=color
    item1.innerText=text
}

// Get near by items from the top,bottom,left and right
function checkNearByItems(target){
    // Getting the position of the target
    const targetColumn=target.getAttribute("data-column")
    const targetRaw=target.getAttribute("data-raw")

    // These two variables will be used to iterate through the top and bottom items
    let targetRawTop=targetRaw
    let targetRawBottom=targetRaw
    //  These two variables will be used to iterate through the left and right items
    let targetColumnLeft=targetColumn
    let targetColumnRight=targetColumn
    
    // As much as there is item has the same color as the target the while loop will keep running
    let isSameColorTop=true
    let isSameColorBottom=true
    let isSameColorLeft=true
    let isSameColorRight=true

    // Storing near by items that has the same color as the target
    let arr=new Array()

    while(isSameColorTop || isSameColorBottom || isSameColorLeft || isSameColorRight){
        let selector=`div[data-raw="${Number(targetRawTop)-1}"][data-column="${targetColumn}"]`
        let item=document.querySelector(selector)

        // Verify if the top item has the same color as the target
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorTop){
            arr.push(item)
            targetRawTop=item.getAttribute("data-raw")
            isSameColorTop=true
        }else isSameColorTop=false

        // Verify if the Bottom item has the same color as the target
        selector=`div[data-raw="${Number(targetRawBottom)+1}"][data-column="${targetColumn}"]`
        item=document.querySelector(selector)
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorBottom){
            arr.push(item)
            targetRawBottom=item.getAttribute("data-raw")
            isSameColorBottom=true
        }else isSameColorBottom=false

        // Verify if the previous item has the same color as the target
        selector=`div[data-raw="${targetRaw}"][data-column="${Number(targetColumnLeft)-1}"]`
        item=document.querySelector(selector)
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorLeft){
            arr.push(item)
            targetColumnLeft=item.getAttribute("data-column")
            isSameColorLeft=true
        }else isSameColorLeft=false

        // Verify if the next item has the same color as the target
        selector=`div[data-raw="${targetRaw}"][data-column="${Number(targetColumnRight)+1}"]`
        item=document.querySelector(selector)
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorRight){
            arr.push(item)
            targetColumnRight=item.getAttribute("data-column")
            isSameColorRight=true
        }else isSameColorRight=false
    }

    return arr
}

// Smatch items that matches the selected item and calculate the final score
function smatchItems(target){
    const arr=checkNearByItems(target)
    arr.forEach(item=>{
        if(item.hasAttribute("draggable")){
            item.removeAttribute("draggable")
            smatchItems(item)
            item.style.backgroundColor="black"
            score+=5
        }
    })
}


// Preventing the default behaviour while dragging over the main element
main.addEventListener("dragover",(e)=>e.preventDefault())

main.addEventListener("drop",(e)=>{
    // At this point the selected item is the only element that has the class drag
    const selected=document.querySelector(".drag")
    const target=e.target

    // When we drag an element without starting the game we return
    if(!selected) return

    // Get the position of both items selected item and target
    const selectedItemRaw=selected.getAttribute("data-raw")
    const selectedItemColumn=selected.getAttribute("data-column")
    const targetRaw=target.getAttribute("data-raw")
    const targetColumn=target.getAttribute("data-column")
    const selectedItemBackgroundColor=selected.style.backgroundColor
    const targetBackgroundColor=target.style.backgroundColor

    // Make sure that we can drop the selected item only on the targets that are close to it
    const nearByRaw= selectedItemRaw==targetRaw && 
                    (targetColumn==Number(selectedItemColumn)+1 || targetColumn==Number(selectedItemColumn)-1) &&
                    selectedItemBackgroundColor!=targetBackgroundColor &&
                    targetBackgroundColor!="black" && selectedItemBackgroundColor!="black"

    const nearByColumn= selectedItemColumn==targetColumn && 
                    (targetRaw==Number(selectedItemRaw)+1 || targetRaw==Number(selectedItemRaw)-1) &&
                    selectedItemBackgroundColor!=targetBackgroundColor &&
                    targetBackgroundColor!="black" && selectedItemBackgroundColor!="black"

    if(nearByRaw || nearByColumn){
        // Exchang backgound color and text content between the selected item and the target
        changeAttributes(target,selected)
        // Smatch items for both target and selected Items
        smatchItems(target)
        smatchItems(selected)
        // Display score
        const span=document.getElementById("score")
        span.innerText=score
    }

    // Return the opacity of the selected item to one after drop
    selected.classList.remove("drag")
})

// Starting the game
document.querySelector(".fa-play").addEventListener("click",(e)=>{
    const button=e.target
    // changing the icon from start to pause
    button.classList.remove("fa-play")
    button.classList.add("fa-pause")
    // Adding dragstart event to the created items
    const items=document.querySelectorAll(".item")
    items.forEach(item=>{
        // Changing the opacity of the item each time dragstart is called
        item.addEventListener("dragstart",(e)=>{
            item.classList.add("drag")
        })
    })

    // Discount
    setInterval(()=>{
        if(min >= 0){
            const span=document.querySelector("header > span")
            span.innerText=`${min}:${second}`
            if(second > 0)
                second--
            else{
                second=59
                min--
            }
        }else location.reload()
    },1000)
})

// Restarting the game
document.querySelector(".fa-repeat").addEventListener("click",(e)=>{
    location.reload()
})

/*
This function is needed to reorder our items 
in case we want to remove the matching items
because the raw and column attributes will 
no longer point correctly on the position 
of the item

function reorder(column){
    let i=0
    let j=0
    const items=document.querySelectorAll(".item")
    items.forEach((item)=>{
        item.setAttribute("data-raw",i)
        item.setAttribute("data-column",j)
        if(j==column-1){
            i++
            j=0
        }else j++
    })
} */
  
