
//Gets Data of all Users from LocalStorage
export const getDataFromLocalStorage = () =>{
    return JSON.parse(localStorage?.getItem(('users') )) || []
}

//Adds Data to LocalStorage
export const addDataToLocalStorage = (values) =>{
    let returnVariable
    returnVariable = getDataFromLocalStorage()
    if(userExists(values))
        {
            let indexVariable = returnVariable?.findIndex((item)=>item?.userName?.toLowerCase()?.replace(/ /g,'')?.trim() == values?.userName?.toLowerCase()?.replace(/ /g,'')?.trim()
            && item?.year == values?.year && item?.month == values?.month
        )
            returnVariable[indexVariable] = values  
        }
    else{
        returnVariable?.push(values)
    }
    localStorage.setItem('users',JSON.stringify(returnVariable))
}


//Finds Name of User from LocalStorage
export const findUser = (user) =>{
    return getDataFromLocalStorage()?.filter((item)=>item?.userName?.toLowerCase()?.replace(/ /g,'')?.trim()?.includes(user))?.map((item)=>item?.userName)
}

//Gets user from local Storage
export const userExists = (user) =>{
    let returnVariable = false
    let data = getDataFromLocalStorage()
    data = data?.find((item)=>item?.userName?.toLowerCase()?.replace(/ /g,'')?.trim() == user.userName?.toLowerCase()?.replace(/ /g,'')?.trim() && new Date(item?.year)?.getFullYear() == new Date(user?.year)?.getFullYear() && item?.month == user?.month)
    returnVariable = data
    return returnVariable
}

//Flag for Displaying Expense Item
export const showExpenseItems = (values) =>{
    let returnVariable = false

    if(values?.month !== '' && values?.year !== '' && values?.budget !== '' && values?.userName !== '' )
        {
            returnVariable = true
        }
    else{
            returnVariable = false
    }

    return returnVariable
}

//Checks Expense is empty or not  
export const isAllAmountEmpty = (values) =>{
    let returnVariable = false
   
    values?.map((expense)=>{
        if(expense?.amount == ''){
                returnVariable = true
        }
    })
   
    
    return returnVariable
}
