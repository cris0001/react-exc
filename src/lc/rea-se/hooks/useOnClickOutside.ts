import {useEffect} from "react";

function useOnClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    fn: (e: MouseEvent) => void){


    useEffect(() => {

      const handler = (e:MouseEvent)=>{

          const el = ref.current
        if(el && !el.contains(e.target as Node)) fn(e)

      }

      window.addEventListener('mousedown', handler)
        return()=> window.removeEventListener('mousedown',handler)

    }, [fn,ref]);

}