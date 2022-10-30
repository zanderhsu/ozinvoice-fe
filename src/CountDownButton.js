import { useState, useEffect } from "react";

/*

props:
onClick: an async function 
seconds: secs to count down
text: button text
*/
function CountDownButton(props)
{
    const [CountDown,setCountDown] = useState(0) 

    const onClick = async()=>{
        if(await props.onClick() === true) 
        {
            setCountDown(props.seconds)
        }
    }

    useEffect(()=>{
        const toCountDown = ()=>
        {
            if(CountDown > 0)
            {
                setCountDown(CountDown-1)
            }
        }
        setTimeout(toCountDown,1000)
    },[CountDown])

    return <button disabled={CountDown>0} onClick={onClick}>{CountDown>0?`⏱${CountDown} seconds`:props.text}</button>
}

export default CountDownButton