import React, { useEffect, useState } from 'react'
import months from '../data/months.json'
import { findUser } from '../helperFunctions/helpers';

function AutocompleteComponent({ values, setFieldValue, handleChange, validateForm, setIsUserSelected, setStartDate, setEndDate ,isUserSelected ,setValues}) {
    const [dataItems, setDataItems] = useState()
    const [showDropDown, setShowDropDown] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState("")


    // EVENT HANDLERS STARTED

    const handleUserName = (userName) => {
        setShowDropDown(true)
        let name = userName?.toLowerCase()?.replace(/ /g, '')?.trim()
        setFieldValue('userName', userName)
        let dateItemsVariable = ([...new Set(findUser(name))])
        setDataItems(dateItemsVariable)
        setIsUserSelected(false)
    }
    const handleItem = (e, index) => {
        let valuesVariable = dataItems?.[index]
        let userName = valuesVariable
        setFieldValue('userName', userName)
        setShowDropDown(false)
        setIsUserSelected(true)
    }
    const handleNoItem = () => {
        setShowDropDown(false)
        setIsUserSelected(true)
    }
    useEffect(() => {
        window.addEventListener('click', () => {
            setShowDropDown(false)
        })
        // validateForm()
    }, [values?.year])

    const handleKeyEvent = (e) => {
        if (e?.code === "Escape") {
            setShowDropDown(false)
            setSelectedIndex("")
        }
        if (e?.code === "ArrowDown") {
            if (selectedIndex === "") {
                setSelectedIndex(0)
            }
            else {
                console.log("hi")
                console.log(dataItems?.length - 1)
                if (selectedIndex < (dataItems?.length - 1)) {
                    setSelectedIndex(keyInde => keyInde + 1)
                }
                else {
                    setSelectedIndex(0)
                }
            }
        }

        if (e?.code === "ArrowUp") {
            if (selectedIndex === "") {
                setSelectedIndex(0)
            }
            else {
                if (selectedIndex === 0) {
                    setSelectedIndex(dataItems?.length - 1)
                }
                else {
                    setSelectedIndex(keyInde => keyInde - 1)
                }
            }
        }
        if (e?.code == "Enter") {
            e?.preventDefault()
        }
        if (e?.code == "Enter" && selectedIndex !== "") {
            let valuesVariable = dataItems?.[selectedIndex]
            let userName = valuesVariable
            setFieldValue('userName', userName)
            setShowDropDown(false)
            setIsUserSelected(true)
        }
        if (e?.code == "Enter" && selectedIndex == "") {
            setShowDropDown(false)
            setIsUserSelected(true)
        }
    }


    const handleMouseEvent = (index) =>{
        setSelectedIndex(index)
    }
    useEffect(()=>{
        let valuesVariable = {}
        valuesVariable["userName"] = values?.userName
        valuesVariable['year'] = ""
        valuesVariable['month'] = ""
        valuesVariable['budget'] = ""
        valuesVariable['expenseItems'] = [
            {
                spendType: '',
                date: '',
                amount: ''
            }
        ]
        setValues(valuesVariable,true)
    },[values?.userName])
    // EVENT HANDLERS ENDED
    return (
        <>
            <input
                type='text'
                className='border h-[3rem] w-full rounded-[2rem] p-4'
                value={values?.userName}
                onChange={(e) => handleUserName(e?.target?.value)}
                onKeyDown={(e) => handleKeyEvent(e)}
                placeholder='Enter UserName'
            />
            {
                values?.userName?.toLowerCase()?.replace(/ /g, '')?.trim()?.length > 2 && showDropDown ?
                    <div className='container border px-4 mt-[-8px] bg-slate-300 w-[90%] mx-auto'>
                        {
                            dataItems?.length > 0 ?
                                dataItems?.map((item, index) => {
                                    return <div
                                        key={index}
                                        value={item}
                                        onClick={(e) => handleItem(e, index)}
                                        onMouseEnter={(e)=>{handleMouseEvent(index)}}
                                        className={`cursor-pointer my-2 ${selectedIndex === index ? 'bg-slate-200' : ''} `}
                                    >
                                        {item}
                                    </div>
                                })
                                :
                                <div
                                    onClick={(e) => handleNoItem()}
                                    className='cursor-pointer my-2 hover:bg-slate-200'
                                >
                                    No Item Found
                                </div>
                        }
                    </div>
                    :
                    ''
            }


        </>

    )
}

export default AutocompleteComponent