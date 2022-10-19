import { useState,useEffect} from "react"
import GroupPairInput from "./GroupPairInputs"
import Utility from "./utils";
import UserData from "./UserData";
/*
props.user = {

}
*/

var sLastSavedUser = {};


function UserInfoEdit(props)
{
   const [user,setUser] = useState({});
   const [isReadOnly, setIsReadOnly] = useState(true);
   const [editBtnTxt, setEditBtnTxt] = useState("Edit")


   const handleChange = (e)=>{
        user[e.target.name] = e.target.value;
        setUser({...user});
   }

    const handleEditUser = ()=>{
        if(editBtnTxt === "Edit"){
            setIsReadOnly(false);
            setEditBtnTxt("Done")
        }
        else
        {
            if(Utility.deepCompare(sLastSavedUser,user)){
                console.log("No need to update")
                return;
            }
            saveUserInfo(user);
            setIsReadOnly(true);
            setEditBtnTxt("Edit")
        }
    }

    const saveUserInfo = (user)=>
    {
        UserData.updateUser(user).then((result)=>
        {
            
            if(result.success)
            {
                sLastSavedUser = Utility.deepCopy(user,5)
                alert(result.message); //maybe do something different
            }
            else
            {
                // console.log(JSON.stringify(response.data)); 
                alert(result.message); 
            }
        })
        .catch( (error)=> {
            alert(error);
        })
    }

    useEffect(()=>{
        const fetchUserByName = async ()=>{
            if(Utility.checkIfRequestTooFrequent("GET_USER_BY_NAME"))
            {
                return;
            }
    
            let userObj = await UserData.getUserByName(props.userName)
  
            if(userObj != null)
            {
                sLastSavedUser = Utility.deepCopy({...userObj},5)
                setUser({...userObj})
            }
            else
            {
                alert("something wrong in getting user information");
            }

        }

        fetchUserByName();
    },[props.userName])

    return <fieldset id="user-edit">
        <legend style={{textAlign:"center"}}>{props.userName}</legend>
        <GroupPairInput dataObj={user} handleChange={handleChange} readOnly={isReadOnly} readOnlyProps={['user_name']}/>
        <button onClick={handleEditUser}>{editBtnTxt}</button> 
    </fieldset>
}

export default UserInfoEdit