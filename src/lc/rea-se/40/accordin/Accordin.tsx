import {memo, useCallback, useState} from "react";


const items = [
    { id: 1, title: "Sekcja 1", content: "Treść pierwszej sekcji" },
    { id: 2, title: "Sekcja 2", content: "Treść drugiej sekcji" },
    { id: 3, title: "Sekcja 3", content: "Treść trzeciej sekcji" },
]


type Item = {
    id:number,
    title:string,
    content:string
}


type AccordinItemProps={
    item:Item
    expand: (id:number)=> void
    expanded:boolean
}

function AccordinItemBase({item,expand,expanded}:AccordinItemProps){

    return(
        <div className={'flex flex-col border border-gray-300 py-2  rounded'}>
            <button aria-controls={`panel-${item.id}`} aria-expanded={expanded} className={'text-left px-4'} onClick={()=> expand(item.id)} >{item.title}</button>


            <div role="region"
                 id={`panel-${item.id}`} style={{
                display:'grid',
                gridTemplateRows: expanded? '1fr':'0fr',
                transition:'all 0.5s'
            }}>
                <div style={{overflow:'hidden'}}>
                    <div className={'p-8'}>{item.content}</div>
                </div>
            </div>


        </div>
    )

}
const AccordinItem = memo(AccordinItemBase)


export  function Accordin(){

        const [expandedId, setExpandedId] = useState<number | null>(null)


    const expand = useCallback((id:number)=>{
        setExpandedId((l)=> l===id? null:id)
    },[])

    return(
        <>
            <div className={'p-4 w-[444px] flex flex-col gap-4'}>
                {items.map((el)=> <AccordinItem expanded={el.id === expandedId} expand={expand} item={el} key={el.id}/>)}
            </div>

        </>
    )

}