import * as Yup from 'yup';
 
 const formValidation = Yup.object().shape({
    userName: Yup.string().required('UserName Required'),
    year: Yup.string().required('Year Required'),
    month: Yup.string().required('Month Required'),
    budget: Yup.string().matches(/^0*[1-9]\d*$/,"Enter Positive Value").required('Budget Required'),
    expenseItems:Yup.array().of(
      Yup.object().shape({
         spendType:Yup.string().required('spendType Required'),
         date:Yup.string().required('date Required'),
         amount:Yup.string().matches(/^0*[1-9]\d*$/,"Enter Positive Value").test('Budget', "Budget exceeded..!", (value,ctx) => {
               let budget = Number(ctx?.from?.[1]?.value?.expenseItems?.reduce((acc, curr) => Number(acc) + Number(curr?.amount), 0))
               if(Number(ctx?.from?.[1]?.value?.budget) >= budget )
                  {
                     return true
                  }
               else{
                  return false
               }
            }, 
          ).required('amount Required'),
      })
    )
 });
 
 export default formValidation