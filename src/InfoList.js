import Utility from "./utils";

import { useRef, useState } from "react";
import GroupPairInputs from "./GroupPairInputs";


function InfoList(props){
     
    const [curEditIndex,setCurEditIndex] = useState(-1);
    const [curEditItem, setCurEditItem] = useState(null);
    const [isInEditNewItem, setIsInEditNewItem] = useState(false);
    const LastSavedItem = useRef(null)

    const addEmptyItem = ()=>{
        props.addEmptyItem();
        let curIndex = props.dataArray.length-1;
        setCurEditIndex(curIndex);

       // props.dataArray[curIndex][props.idName] = curIndex;
        setCurEditItem({...props.dataArray[curIndex]})
        LastSavedItem.current = {...props.dataArray[curIndex]}// don't user curEditItem here, as it's not updated yet
        setIsInEditNewItem(true);
        
    }

    const deleteItemFromDB = async(index)=>{

        if(false === window.confirm(`Are you deleting [${props.dataArray[index].business_name}]?`))
        {
            return
        }

        let result = {succes:false,message:"do nothing"};
          
        result = await props.deleteItemFromDB(index)
   
        if(result.success)
        {
            //notify parent componentn to udpate its  array
            props.updateForItemDeleted(index);
            setCurEditIndex(-1)
        }
        else
        {
            alert(result.message); 
        }
    }

    const onCancelButtonCick = (index)=>{
        setCurEditIndex(-1);
        if(isInEditNewItem)
        {
            props.updateForItemDeleted(index);
            setIsInEditNewItem(false);
        }
    }

    const onEditButtonClick = (index)=>{
        setCurEditIndex(index)
        setCurEditItem(props.dataArray[index])
        LastSavedItem.current = {...props.dataArray[index]}
    }

    const handleInputChange = (e)=>{
        let newValue = e.target.value
        let fieldName = e.target.name
        if(Utility.IsDigitField(fieldName) && newValue!=="" && newValue.match(/^\d+$/) === null)
        {
            return;
        }
        curEditItem[fieldName] = newValue;
        setCurEditItem({...curEditItem})
    }

    const updateItemToDB = async()=>{
        
        let result = {success:false,message:"Nothing changed"};
        //add a new item
        if(Utility.shallowCompare(LastSavedItem.current,curEditItem))
        {
            console.log("Unchanged, nothing to do")
        }
        else
        {
            if(Utility.checkIfRequestTooFrequent("UPDATE_"+props.subject))
            {
                alert('PLEASE DO NOT SUBBMIT REUQEST TOO OFTEN!')
                return;
            }

            if(isInEditNewItem)
            {
                result = await props.addItemToDB(curEditItem)
            }
            else
            {
                //do updating item
                result = await props.updateItemToDB(curEditIndex,curEditItem);
            }
        }

        if(result.success)
        {
            //notify parent componentn to udpate its array
            props.updateItemFromEdit(curEditIndex,curEditItem);  
            setCurEditIndex(-1)
            if(isInEditNewItem) {setIsInEditNewItem(false)}

        }
        else
        {
            alert(result.message); 
        }
        
    }
        
    return <div id={props.containerIdName}>
           
           {
           
               Array.isArray(props.dataArray) && props.dataArray.map((item,index)=>{

                    const isBeingEditing = (curEditIndex===index);
               
                    const dataObject = isBeingEditing?curEditItem:item

                    return <fieldset key={index}>
                        <legend>{item.business_name}</legend>
                        {isBeingEditing&&<GroupPairInputs 
                                dataObj={dataObject} 
                                handleChange={handleInputChange} 
                                readOnly={!isBeingEditing} 
                                hiddenProps={props.hiddenProps}/>}
                    
                    <div className="uc-list-button-container">
                        {isBeingEditing?<>
                            <button onClick={updateItemToDB}>{isInEditNewItem?"✚Add":"✔Update"}</button>
                            <button onClick={()=>{onCancelButtonCick(index)}}>⤴Cancel</button></>
                            :<><button onClick={()=>{onEditButtonClick(index)}}>✍Edit</button>
                            <button onClick={()=>deleteItemFromDB(index)}>✘Delete</button>
                                {props.specialButton(index)}</>
                            }
                        </div></fieldset>
                    })
                  
               }
               {!isInEditNewItem && <fieldset className="uc-add-button-container"><legend style={{padding:"0px",color:"lightgray"}}>‑   </legend><p onClick={addEmptyItem}>✚</p></fieldset>}
               
        </div>
}

export default InfoList;