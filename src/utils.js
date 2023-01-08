const Utility = (function(){

    const getNumberFormat = (number,isMoney)=>
    {
        if(isNaN(number)) {
            return number;
        }
        const ret = Math.round(number*100)/100;
        
        let NFObj;
        if(isMoney)
        {
            NFObj = Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });
        }
        else
        {
            NFObj = Intl.NumberFormat();
        }
        return NFObj.format(ret);
    }

    const NANtoZero = (num) =>{
        if(num === "" || isNaN(num)){
            return 0;
        }
        
        return parseFloat(num); 
    }

    const shallowCompare = (ObjA, ObjB)=>
    {
        if(typeof ObjA !== 'object' && typeof ObjB !== 'object')
        {
        
            return ObjA === ObjB;
        }

        if(ObjA === null || ObjA === undefined || !isNaN(ObjA)
            ||ObjB === null || ObjB === undefined || !isNaN(ObjB))
        {
            return ObjA === ObjB;
        }

        if(Object.keys(ObjA).length !== Object.keys(ObjB).length)
        {
        return false;
        }

        for(let p in ObjA)
        {
            if(ObjA[p] !== ObjB[p])
            {
                return false;
            }
        }

        return true;
    }
    //only compare real object values, not null, undefined 
    function deepCompare(ObjA, ObjB)
    {
        if(ObjA === null || ObjA === undefined || isNaN(ObjA)
            ||ObjB === null || ObjB === undefined || isNaN(ObjB) )
        {
            return ObjA === ObjB;
        }

        if(typeof ObjA !== 'object' && typeof ObjB !== 'object')
        {
                return ObjA === ObjB;
        }
        // at least one is Object, Object.keys(primite).length will return 0
        if(Object.keys(ObjA).length !== Object.keys(ObjB).length)
        {
            return false;
        }

        for(let p in ObjA)
        {
                if(!deepCompare(ObjA[p],ObjB[p]))
                {
                    return false;
                }
        }

            return true;
    }


    function deepCopy(sourceObj,level)
    {
        if(sourceObj === undefined || level === undefined)
        {
            return null;
        }
        let retObj;
        
        if(typeof sourceObj === 'object' && sourceObj !== null)
        {
            if(Array.isArray(sourceObj))
            {
                retObj = [...sourceObj]
            }
            else{
                retObj = {...sourceObj}
            }

            for(let i=0;i<level;i++)
            {
                for(let p in sourceObj)
                {
                    retObj[p] = deepCopy(sourceObj[p],level-1);
                }
            }
        }
        else
        {
            retObj = sourceObj;        
        }

        return retObj;
    }

    //get the count after decimal
    const afterDecimal = (num) =>{
        
        num = parseFloat(num)
    
        if(isNaN(num)){
            console.log(num+" is not a number")
            return 0;
        }

        if(Number.isInteger(num)) 
        {
        return 0;
        }
    
        return num.toString().split('.')[1].length;
    }

    const actionForWaiting = (isWaiting)=>
    {
        if(isWaiting)
        {
            document.body.style.cursor = "wait";
        }
        else
        {
            document.body.style.cursor = "auto";
        }
    }

    var _LastRequestTime = (new Date()).getTime();
    var _LastRequestType = "";
    const checkIfRequestTooFrequent =(requestType)=>
    {
        let lastTime= _LastRequestTime;
        let lastRequestType = _LastRequestType;

        _LastRequestTime = (new Date()).getTime();
        _LastRequestType = requestType;

        if(_LastRequestTime-lastTime < 1000 && lastRequestType === requestType)
        {
            console.log(`avoid frequent ${requestType} request!`);
            return true;
        }
        return false;
    }

    /*
    return {
        pass: true false
        reason:
    }
    */
    const validatePassword = (password)=>
    {
        const userPwdMinLen = 8;
        const userPwdMaxLen = 32;
        if(password.length < userPwdMinLen || 
            password.length > userPwdMaxLen || 
            null === String(password).match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/))
        {
            return {pass:false, reason:`password at least ${userPwdMinLen} characters(at most ${userPwdMaxLen} characters),at least one letter and one number`}   
        }
        return {pass:true,reason:""}
    }

    /*
    return {
        pass: true false
        reason:
    }
    */
    const validateUserName = (userName)=>
    {
        const userNameMinLen = 5;
        const userNameMaxLen = 32;


        if(userName.length < userNameMinLen || userName.length > userNameMaxLen) 
        {
            return {pass:false, reason:`User name at least ${userNameMinLen} characters and don't exceed ${userNameMaxLen} characters`}
            
        }
        return {pass:true,reason:""}
    }

    const validateEmail = (email) => {
        let ret = (null !== String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ))

        return {pass:ret ,reason:ret?"":"Invalid email address"}
    };

    var _LoginToken="" // in case cookie are disabled to write
    const saveToken = (token)=>{
        _LoginToken = token;
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 30);
        document.cookie = "token="+token+";expires="+expDate+";path=/;";
        
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const readToken = ()=>{
        
        if(_LoginToken!=='')
        {
            return _LoginToken;
        }
        return getCookie("token")
    }

    const getCurrentDateString = ()=>
    {
        let rightNow = new Date();
        return rightNow.toISOString().slice(0,10);
    }

    const IsDigitField = (fieldName)=>
    {
        switch(fieldName)
        {
            case 'phone':
            case 'abn':
            case 'ABN':
            case 'bsb':
            case 'BSB':
            case 'account_number':
            case 'unit_price':
            case 'quantity':
            case 'tax_rate':
            case 'discount':
            case 'amount':
                return true
            default:
                break;

        }
        return false
    }

    return {
        getNumberFormat:getNumberFormat,
        NANtoZero:NANtoZero,
        shallowCompare:shallowCompare,
        deepCompare:deepCompare,
        deepCopy:deepCopy,
        afterDecimal:afterDecimal,
        actionForWaiting:actionForWaiting,
        checkIfRequestTooFrequent:checkIfRequestTooFrequent,
        validatePassword:validatePassword,
        validateUserName:validateUserName,
        validateEmail:validateEmail,
        saveToken:saveToken,
        readToken:readToken,
        getCookie:getCookie,
        getCurrentDateString:getCurrentDateString,
        IsDigitField:IsDigitField
    }

})();
export default Utility;