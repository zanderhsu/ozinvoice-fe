import { useState,useEffect} from "react"
import GroupPairInput from "./GroupPairInputs"
import Utility from "./utils";
import UserData from "./UserData";
/*
props.user = {

}
*/

var sLastSavedUser = {};

//shallowCopy is fine
function UserInfoEdit(props)
{
    const [userToEdit, setUserToEdit] = useState({...props.basics})

    const handleChange = (e)=>{
        userToEdit[e.target.name] = e.target.value;
        setUserToEdit({...userToEdit});
   }

    const toUpdateUser = ()=>{
    
        if(Utility.shallowCompare(sLastSavedUser,userToEdit)){
            console.log("No need to update")
            return;
        }

        /*avoid frequent access*/
        if(Utility.checkIfRequestTooFrequent("UPDATE_USER"))
        {
            return;
        }
        
        UserData.updateBasics(userToEdit).then((result)=>{
            if(result.success)
            {
                //sLastSavedUser = {...userToEdit};
                props.updateUserFromEdit(userToEdit);
                
                props.toClose();
            }
            alert(result.message); 
        }).catch((error)=>{
            console.log(error)
            alert("Something wrong during updating users");
        })
        
    }


    useEffect(()=>{
        //save last user infor at the beginning
        sLastSavedUser = {...props.user}
    },[props.user])

    
    return <fieldset id="user-edit">
        <legend style={{textAlign:"left"}}>Your user name {props.user.user_name}</legend>
        <GroupPairInput dataObj={userToEdit} handleChange={handleChange}  hiddenProps={['create_at']}/>
        <button onClick={toUpdateUser}>Update</button>  <button onClick={props.toClose}>Close</button>
    </fieldset>
}

export default UserInfoEdit