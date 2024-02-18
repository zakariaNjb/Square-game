// Number of raws and columns
const RAW=7
const COLUMN=7

// Create an item and add it to the main element
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
            // Change the opacity of the item each time dragstart is called
            div.addEventListener("dragstart",(e)=>{
                div.classList.add("drag")
            })
            main.append(div)
        }  
    }
}

// This function is used to change the background color and text content between two items
function changeAttributes(item1,item2){
    const color=item2.style.backgroundColor
    const text=item2.innerText
    item2.style.backgroundColor=item1.style.backgroundColor
    item2.innerText=item1.innerText
    item1.style.backgroundColor=color
    item1.innerText=text
}

// This function is used to get near by items
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
    
    //As much as there items has the same color as the target the while loop will keep running
    let isSameColorTop=true
    let isSameColorBottom=true
    let isSameColorLeft=true
    let isSameColorRight=true

    // This array will be used to store the near by items that has the same color as the target
    let arr=new Array(target)

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


// This function is used to reorder our items
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
}

// Preventing the default behaviour while dragging over the main element
main.addEventListener("dragover",(e)=>e.preventDefault())

main.addEventListener("drop",(e)=>{
    // At this point the selected item is the only element that has the class drag
    const selectedItem=document.querySelector(".drag")
    const target=e.target

    // Get the position of both items selected item and target
    const selectedItemRaw=selectedItem.getAttribute("data-raw")
    const selectedItemColumn=selectedItem.getAttribute("data-column")
    const targetRaw=target.getAttribute("data-raw")
    const targetColumn=target.getAttribute("data-column")
    const selectedItemBackgroundColor=selectedItem.style.backgroundColor
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
        // Exchanging the backgound color and text content between the selected item and the target
        changeAttributes(target,selectedItem)
        // Getting the near by items
        const arr=checkNearByItems(target)
        console.log(arr)
        // Make sure that the array has more items not only the target
        // arr.forEach(item=>item.remove())
        if(arr.length > 1) arr.forEach(item=>item.style.backgroundColor="black")
        // As we deleted some elements now we should reorder the remaing ones
        reorder(COLUMN)
    }

    // Once we drop the element we return the opacity of the selected item to one
    selectedItem.classList.remove("drag")
})





  
  
