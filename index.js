const main=document.querySelector("main")
const raw=5
const column=5

window.onload=(e)=>{
    const colors=["red","yellow","orange","blue","green","purple"]
    const texts=["R","Y","O","B","G","P"]

    for(i=0;i<raw;i++){
        for(j=0;j<column;j++){
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

    const items=document.querySelectorAll(".item")
    items.forEach(item=>{
        item.addEventListener("dragstart",(e)=>{
            item.classList.add("drag")
        })
    })
}

function changeAttributes(item1,item2){
    const color=item2.style.backgroundColor
    const text=item2.innerText
    item2.style.backgroundColor=item1.style.backgroundColor
    item2.innerText=item1.innerText
    item1.style.backgroundColor=color
    item1.innerText=text
}

function checkRaw(target){
    let targetRawTop=target.getAttribute("data-raw")
    let targetRawBottom=targetRawTop
    const targetColumn=target.getAttribute("data-column")
    let isSameColorTop=true
    let isSameColorBottom=true
    let arr=new Array()
    while(isSameColorTop || isSameColorBottom){
        let selector=`div[data-raw="${Number(targetRawTop)-1}"][data-column="${targetColumn}"]`
        let item=document.querySelector(selector)
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorTop){
            arr.push(item)
            targetRawTop=item.getAttribute("data-raw")
            isSameColorTop=true
        }else isSameColorTop=false

        selector=`div[data-raw="${Number(targetRawBottom)+1}"][data-column="${targetColumn}"]`
        item=document.querySelector(selector)
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorBottom){
            arr.push(item)
            targetRawBottom=item.getAttribute("data-raw")
            isSameColorBottom=true
        }else isSameColorBottom=false
    }

    return arr
}


function checkColumn(target){
    let targetColumnLeft=target.getAttribute("data-column")
    let targetColumnRight=targetColumnLeft
    const targetRaw=target.getAttribute("data-raw")
    let isSameColorLeft=true
    let isSameColorRight=true
    let arr=new Array()
    while(isSameColorLeft || isSameColorRight){
        let selector=`div[data-raw="${targetRaw}"][data-column="${Number(targetColumnLeft)-1}"]`
        let item=document.querySelector(selector)
        if(item && item.style.backgroundColor==target.style.backgroundColor && isSameColorLeft){
            arr.push(item)
            targetColumnLeft=item.getAttribute("data-column")
            isSameColorLeft=true
        }else isSameColorLeft=false

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

function reorder(column){
    let i=0
    let j=0
    const items=document.querySelectorAll(".item")
    items.forEach((item)=>{
        item.setAttribute("data-raw",i)
        item.setAttribute("data-column",j)
        console.log(1 % 4)
        if(j==column-1){
            i++
            j=0
        }else j++
    })
}

main.addEventListener("dragover",(e)=>e.preventDefault())

main.addEventListener("drop",(e)=>{
    const selectedItem=document.querySelector(".drag")
    const target=e.target

    const selectedItemRaw=selectedItem.getAttribute("data-raw")
    const selectedItemColumn=selectedItem.getAttribute("data-column")
    const targetRaw=target.getAttribute("data-raw")
    const targetColumn=target.getAttribute("data-column")

    const nearByRaw= selectedItemRaw==targetRaw && (targetColumn==Number(selectedItemColumn)+1 || targetColumn==Number(selectedItemColumn)-1) 
    const nearByColumn= selectedItemColumn==targetColumn && (targetRaw==Number(selectedItemRaw)+1 || targetRaw==Number(selectedItemRaw)-1)

    if(nearByRaw || nearByColumn){
        changeAttributes(target,selectedItem)
        const arrColumn=checkColumn(target)
        const arrRaw=checkRaw(target)
        const arr=arrColumn.concat(arrRaw)
        arr.push(target)
        arr.forEach(item=>item.remove())
        reorder(column)
    }

    selectedItem.classList.remove("drag")
})

