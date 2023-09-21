import React,{useState} from 'react'

export const Disperse = () => {
const [userInput,setUserInput] = useState("");
const [isDuplicate,setIsDuplicate] = useState(false);
const [errors, setErrors] = useState([]);
const [inputIndex, setInputIndex] = useState(1)

  const onSubmit = ()=>{
    setErrors([]);
    if(userInput){
        const inputAddresses = userInput.trim().split('\n');
        let inputAddress = ''
        let tempObj = {}
        for(let i=0; i<inputAddresses.length; i++){
            let el = inputAddresses[i]
            const inputArr = el.split(/[ ,=]+/);
            inputAddress = inputArr[0];
            const inputAmount = inputArr[1];
            if(inputArr.length !== 2){
                setErrors(errors => [...errors,{type:"WrongInput",line:i+1}]);
                break;
            }
            if(isNaN(inputAmount)){
                setErrors(errors => [...errors,{type:"WrongAmount",line:i+1}]);
                break;
            }

            if(!tempObj.hasOwnProperty(inputAddress)){
                tempObj[inputAddress] = i+1;
            }
            else{
                tempObj[inputAddress] = tempObj[inputAddress]+ ', '+ +(i+1);
            }

        }
        for (const key in tempObj) {
            if(typeof(tempObj[key]) === 'string'){
                    setErrors(errors => [...errors,{type:"duplicate", address:key ,line:tempObj[key]}]);
                    setIsDuplicate(true);
            }
        }
    }
  }

  const keepFirstOne = ()=>{
    const arr = userInput.split('\n')
    const tempArr=[]
    let resultStr="";
    for(let i=0; i<arr.length; i++){
        const address = arr[i].split(/[ ,=]+/)[0];
        if(!tempArr.includes(address)){
            tempArr.push(address);
            resultStr += arr[i]+'\n';
        }
    }
    setUserInput(resultStr.substring(0,resultStr.length-1));
    setIsDuplicate(false);
    setErrors([])
  }
  const combineBalances = ()=>{
    const arr = userInput.split('\n');
    const tempObj={}
    let resultStr="";
    for(let i=0; i<arr.length; i++){
        const address = arr[i].split(/[ ,=]+/)[0];
        const bal = arr[i].split(/[ ,=]+/)[1];

        if(!tempObj.hasOwnProperty(address)){
            tempObj[address] = bal;
        }
        else{
            tempObj[address] = +tempObj[address]+(+bal);
        }
    }

    for (const key in tempObj) {
        resultStr += key+ ' ' + tempObj[key] + '\n';
    }
    setUserInput(resultStr.substring(0,resultStr.length-1));
    setIsDuplicate(false);
    setErrors([])
  }


  const handleOnChange = (e)=>{
    setUserInput(e.target.value)
    setIsDuplicate(false);
  }

  const handleOnKeyUp = (e)=>{
    const inputText = e.target.value;
    if(e.keyCode === 13){
        setInputIndex(inputIndex+1);
    }
    if(e.keyCode === 8){
        getIndex(inputText)
    }
  }

  const handleOnPaste =(e)=>{
    const inputText = e.clipboardData.getData('text');
    getIndex(inputText)
  }

  const handleOnCut = (e)=>{
    setTimeout(()=>{
        const inputText = e.target.value;
        getIndex(inputText)
    },0)
  }

  const getIndex = (inputText)=>{
    const count = (inputText.match(new RegExp("\n", "g")) || []).length;
    setInputIndex(count+1);
  }

  return (
    <div className='disperse-container'>
        <p className='info-text'>Addresses with Amounts</p>
        <div className='addressesWithAmountsContainer width-full'>
            <form className='input-form'>
                <div>
                    {
                        Array.from({length: inputIndex}, (_, index) => index + 1).map((el)=>{
                            return <p className='p-index' key={el}>{el}</p>
                        })
                    }
                </div>
                <textarea className='text-input' onCut={handleOnCut} onPaste={handleOnPaste} onKeyUp={handleOnKeyUp} onChange={handleOnChange} value={userInput} name="Text1" cols="76" rows="10"></textarea>
            </form>
        </div>
        <p className='info-text'>Separated by ',' or'', or'='</p>
        {isDuplicate && <div className='width-full action-box'>
            <span>Duplicated</span>
            <div className='actions'>
                <span onClick={keepFirstOne} className='action-btn'>
                    Keep the first one
                </span>
                <span onClick={combineBalances}>
                    Combine Balance
                </span>
            </div>
        </div>}
        {errors.length>0 && <div className='width-full error-el'>
            <div>
                <span className='error-icon'>ⓘ</span>
            </div>
            <div className='err-box'>
                {
                    errors.map((er,i)=>{
                        if(er.type === 'WrongInput')
                            return <span key={Math.random()} className='error-text'>Line {er.line} wrong input</span>
                        
                        if(er.type === 'WrongAmount')
                            return <span key={Math.random()} className='error-text'>Line {er.line} wrong amount</span>

                        if(er.type === 'duplicate')
                        return (<span key={Math.random()} className='error-text'>
                                    Address {er.address} encountered duplicate in Line: {er.line}
                                </span>)
                        return <br/>
                    })
                }
            </div>
        </div>}
        <button onClick={onSubmit} className='submit-btn width-full'>Next</button>
    </div>
  )
}

export default Disperse;