import { Formik, useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import AutocompleteComponent from '../components/AutocompleteComponent'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import months from '../data/months.json'
import formValidation from '../schema/validationSchema'
import { addDataToLocalStorage, findUser, isAllAmountEmpty, showExpenseItems, userExists } from '../helperFunctions/helpers'
import Select from 'react-select';
function HomePage() {

    const initialValues = {
        userName: '',
        year: '',
        month: '',
        budget: '',
        expenseItems: [
            {
                spendType: '',
                date: '',
                amount: ''
            }
        ]
    }


    const { values, setValues, setFieldValue, handleSubmit, handleChange, errors, resetForm, touched, validateForm, setFieldTouched, setFieldError } = useFormik({
        initialValues,
        validationSchema: formValidation,
        // validateOnMount:true,

        onSubmit: () => {
            if ((userExists(values)?.length > 0) && (isUserSelected == false)) {
                alert("User Name already Exists..!")
            }
            else {
                addDataToLocalStorage(values)
                resetForm()
            }
        }
    })

    const expenseTypeOptions = ["Rent", "Loan", "Shopping", "Food", "Travelling", "StudyFees"]
    const selectOptions = months?.map((item) => ({ label: item, value: item }))
    const [isUserSelected, setIsUserSelected] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    let autocompleteProps = { values, setFieldValue, handleChange, validateForm, setIsUserSelected, isUserSelected ,setStartDate, setEndDate , setValues}


    //EVENT HANDLERS STARTED

    const addExpense = () => {
        let expenseItemsVariable = values?.expenseItems
        expenseItemsVariable?.push({
            spendType: '',
            date: '',
            amount: ''
        })
        setFieldValue('expenseItems', [...expenseItemsVariable])
    }

    const removeExpense = () => {
        let expenseItemsVariable = values?.expenseItems
        if (values?.expenseItems?.length > 1) {
            expenseItemsVariable?.pop({
                spendType: '',
                date: '',
                amount: ''
            })
            setFieldValue('expenseItems', [...expenseItemsVariable])
        }
        else {
            setFieldValue('expenseItems', [
                {
                    spendType: '',
                    date: '',
                    amount: ''
                }
            ])
        }

    }

    const handleDateChange = (date, index) => {
        let expenseItemsVariable = values?.expenseItems
        expenseItemsVariable[index].date = date
        setFieldValue('expenseItems', expenseItemsVariable)
    }

    const handleAmountChange = (e, index) => {
        let expenseItemsVariable = values?.expenseItems
        expenseItemsVariable[index].amount = Number(e.target.value)
        setFieldValue('expenseItems', expenseItemsVariable)

    }

    const handleBudget = (e) => {
        setFieldValue('budget', e.target.value)
    }

    const handleMonth = async (e) => {

        setFieldValue('month', e?.value)
        setStartDate(new Date(new Date(values?.year)?.getFullYear(), months?.findIndex((month) => month == e?.value), 1))
        setEndDate(new Date(new Date(values?.year)?.getFullYear(), months?.findIndex((month) => month == e?.value) + 1, 0))


        let updatedValueWithMonth = { ...values, month: e?.value }
        userExists(updatedValueWithMonth)

        if (isUserSelected) {
            if (userExists(updatedValueWithMonth)) {
                let valuesVariable = userExists(updatedValueWithMonth)
                valuesVariable['year'] = valuesVariable?.year
                valuesVariable['month'] = valuesVariable?.month
                valuesVariable['budget'] = valuesVariable?.budget
                valuesVariable['expenseItems'] = valuesVariable?.expenseItems
                setValues(valuesVariable, true)
                setStartDate(new Date(new Date(valuesVariable?.year)?.getFullYear(), months?.findIndex((item) => item == valuesVariable?.month), 1))
                setEndDate(new Date(new Date(valuesVariable?.year)?.getFullYear(), months?.findIndex((item) => item == valuesVariable?.month) + 1, 0))
            }
            else {
                setFieldValue('budget', '')
                setFieldValue('expenseItems', [
                    {
                        spendType: '',
                        date: '',
                        amount: ''
                    }
                ])
                setStartDate(new Date(new Date(values?.year)?.getFullYear(), months?.findIndex((item) => item == e?.value), 1))
                setEndDate(new Date(new Date(values?.year)?.getFullYear(), months?.findIndex((item) => item == e?.value) + 1, 0))
            }
        }
        else {
            let expenseItemsVariable = values?.expenseItems
            expenseItemsVariable = expenseItemsVariable?.map((item) => {
                return { ...item, date: '' }
            })
            setFieldValue('expenseItems', [...expenseItemsVariable])
        }
    }
    //EVENT HANDLERS ENDED

    return (
        <>
            <form className=' container mx-auto w-[60%] my-8' onSubmit={handleSubmit}>
                <AutocompleteComponent {...autocompleteProps} />
                {
                    errors?.userName && touched?.userName ?
                        <div className='text-orange-600 text-sm'>{errors?.userName}</div>
                        :
                        ''
                }

                <div className='flex gap-4  justify-between '>
                    
                    <div className='flex my-4 gap-2 items-center mx-2 w-[25%]'>
                        <label htmlFor="">Year: </label>
                        <DatePicker
                            selected={values?.year}
                            className='border p-2'
                            name='year'
                            placeholderText='Select Year'
                            onChange={(date) => setFieldValue('year', date)}
                            showYearPicker
                            minDate={new Date()}
                            dateFormat="yyyy"
                            onKeyDown={(e)=>{e?.code === "Enter" && e?.preventDefault()}}
                        />
                    </div>
                    {
                        errors?.year && touched?.year ?
                            <div className='text-orange-600 text-sm'>{errors?.year}</div>
                            :
                            ''
                    }
                    <div className='flex my-4 gap-2 items-center mx-2 w-[25%]'>
                        <label htmlFor="">Month: </label>
                        <Select
                            className='w-full'
                            name='month'
                            value={{ label: values?.month, value: values?.month }}
                            onChange={(e) => handleMonth(e)}
                            options={selectOptions}
                            onKeyDown={(e)=>{e?.code === "Enter" && e?.preventDefault()}}
                        />
                    </div>
                    {
                        errors?.month && touched?.month ?
                            <div className='text-orange-600 text-sm'>{errors?.month}</div>
                            :
                            ''
                    }
                    <div className='flex my-4 gap-2 items-center mx-2 w-[25%]'>
                        <label htmlFor="">Budget: </label>
                        <input
                            className='border my-4'
                            type="number"
                            min="0"
                            name='budget'
                            value={values?.budget}
                            onChange={(e) => handleBudget(e)}
                            placeholder='Set Budget'
                            onKeyDown={(e)=>{e?.code === "Enter" && e?.preventDefault()}}
                        />
                        {
                            errors?.budget && touched?.budget ?
                                <div className='text-orange-600 text-sm'>{errors?.budget}</div>
                                :
                                ''
                        }
                    </div>

                </div>


                {
                    showExpenseItems(values) ?

                        <div className='ExpenseItems'>
                            <p className='text-xl font-semiBold p-4'>Expenses</p>
                            {
                                values?.expenseItems?.map((expense, index) => {
                                    return <div className='border flex p-4 gap-4' key={index}>
                                        <div className='flex gap-4'>
                                            <label htmlFor="">Spend Type: </label>
                                            <select
                                                className='border '
                                                name={`expenseItems.${[index]}.spendType`}
                                                value={values?.expenseItems?.[index]?.spendType}
                                                onChange={handleChange}
                                                onKeyDown={e => { e.key === 'Enter' && e.preventDefault() }}                                            >
                                                <option value=""></option>
                                                {
                                                    expenseTypeOptions?.map((type) => {
                                                        return <option value={type}>{type}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        {
                                            errors?.expenseItems?.[index]?.spendType && touched?.expenseItems?.[index]?.spendType ?
                                                <div className='text-orange-600 text-sm'>{errors?.expenseItems?.[index]?.spendType}</div>
                                                :
                                                ''
                                        }

                                        <div className='flex gap-4'>
                                            <label htmlFor={`expenseItems.${[index]}.date`}>Spend Date: </label>
                                            <DatePicker
                                                selected={values?.expenseItems?.[index]?.date}
                                                name={`expenseItems.${[index]}.date`}
                                                minDate={startDate}
                                                onKeyDown={e => { e.key === 'Enter' && e.preventDefault() }}                                                maxDate={endDate}
                                                value={new Date(values?.expenseItems?.[index]?.date)}
                                                id={`expenseItems.${[index]}.date`}
                                                onChange={(e) => handleDateChange(e, index)}
                                                className='border'
                                            />
                                        </div>
                                        {
                                            errors?.expenseItems?.[index]?.date && touched?.expenseItems?.[index]?.date ?
                                                <div className='text-orange-600 text-sm'>{errors?.expenseItems?.[index]?.date}</div>
                                                :
                                                ''
                                        }
                                        <div className='flex gap-4'>
                                            <label htmlFor={`expenseItems.${[index]}`}>Amount: </label>
                                            <input
                                                type='number'
                                                name={`expenseItems.${[index]}.amount`}
                                                onKeyDown={e => { e.key === 'Enter' && e.preventDefault() }}                                                value={values?.expenseItems?.[index]?.amount}
                                                id={`expenseItems.${[index]}.amount`}
                                                onChange={(e) => { handleAmountChange(e, index) }}
                                                className='border'
                                                min={0}
                                            />
                                        </div>
                                        {
                                            errors?.expenseItems?.[index]?.amount !== "Budget exceeded..!"
                                                ?
                                                errors?.expenseItems?.[index]?.amount && touched?.expenseItems?.[index]?.amount ?
                                                    <div className='text-orange-600 text-sm'>{errors?.expenseItems?.[index]?.amount}</div>
                                                    :
                                                    ''
                                                :
                                                ''
                                        }
                                    </div>
                                })
                            }
                            <button type='button' className='border my-2 mx-4 px-4' onClick={removeExpense}>
                                Remove
                            </button>
                            <button type='button' className='border my-2 mx-4 px-4' onClick={addExpense} disabled={errors?.expenseItems}>
                                Add
                            </button>
                            <br />
                        </div>

                        :
                        ''
                }

                {
                    errors?.expenseItems?.[0]?.amount == "Budget exceeded..!" ?
                        errors?.expenseItems?.[0]?.amount && (Boolean(isAllAmountEmpty(values?.expenseItems)) == false) ?
                            <div className='text-orange-600 text-sm text-center'>{errors?.expenseItems?.[0]?.amount}</div>
                            :
                            ''
                        :
                        ''
                }
                <button type='submit' className='border my-2 w-[5vw] ms-[45%]'>
                    Save
                </button>
            </form>
        </>
    )
}

export default HomePage
