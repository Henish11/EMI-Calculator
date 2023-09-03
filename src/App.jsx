import { useState,useEffect } from 'react'
import './App.css'
import {numberWithCommas} from '../src/utils/config'

function App() {
  
  const tenureData = [12,24,36,48,60]
  const [cost, setCost] = useState(100000)
  const [interest, setInterest] = useState(9)
  const [fee, setFee] = useState(1)
  const [downPayment, setDownPayment] = useState(0)
  const [emi, setEmi] = useState(0)
  const [tenure, setTenure] = useState(12)
  
  // EMI
  const calculateEmi = (downpayment)=>{
       // emi = P x R x (1+R)^N / [(1+R)^N-1]
       if (!cost) return 
       const loanAmt = cost - downpayment      // P
       const rateOfInteresr = interest / 100   // R
       const numOfYears = tenure/12            // N

       const EMI = (loanAmt*rateOfInteresr*(1+rateOfInteresr)**numOfYears) / ((1+rateOfInteresr)**numOfYears-1)
       return (
          Number(EMI/12).toFixed(0)
       )
  }
  const handleEmi =(e)=>{
    if (!cost) return 

    const dp = Number(e.target.value)
    setDownPayment(dp.toFixed(0))

    const emi = calculateEmi(dp)
    setEmi(emi)
  }

  // DownPayment
  const calculateDownPayment = (emi)=>{
    if (!cost) return 
    const downPaymentPercent = 100 - (emi / calculateEmi(0)) * 100;
    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  }

  const handleDownPayment =(e)=>{
    if (!cost) return 

    const emi = Number(e.target.value)
    setEmi(emi.toFixed(0))

    const dp = calculateDownPayment(emi)
    setDownPayment(dp)
  }

  // Tenure
  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayment(0);
      setEmi(0);
    }

    const emi = calculateEmi(downPayment);
    setEmi(emi);
  }, [tenure, cost]);

  const totalDownPayment = () => {
    return numberWithCommas(
      (Number(downPayment) + (cost - downPayment) * (fee / 100)).toFixed(0)
    );
  };

  const totalEMI = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };

  return (
    <div className='calcWrap'>
      <h2>EMI calculator</h2>
      <form>
        <div className='inputBox'>
          <label className='main'>Total Coast Of Asset</label>
          <input type="number" placeholder='Total Coast Of Asset' value={cost} onChange={(e)=> setCost(e.target.value)} />
        </div>
        <div className='inputBox' >
           <label className='main'> Interest Rate (in %) </label>
          <input type="number" placeholder='Interest Rate' value={interest} onChange={(e)=> setInterest(e.target.value)} />
        </div>
        <div className='inputBox'>
          <label className='main'>Processing Fee (in %) </label>
          <input type="number" placeholder='Processing Fee' value={fee} onChange={(e)=> setFee(e.target.value)}  />
        </div>
        <div className='inputBox'>
          <label className='main'> Down Payment</label>
          <label >{`Total Down Payment - ${totalDownPayment()}`}</label>
          <input type="range" value={downPayment} onChange={handleEmi} min={0} max={cost}/>
          <div className='bottomLabel'>
            <label>{0}%</label>
            <b>{numberWithCommas(downPayment)}</b>
            <label>{100}%</label>
          </div>
        </div>
        <div className='inputBox'>
          <label className='main'> Loan Per Month</label>
          <label >{`Total Loan Amount - ${totalEMI()}`}</label>
          <input type="range" value={emi} onChange={handleDownPayment} min={calculateEmi(cost)} max={calculateEmi(0)} />
          <div className='bottomLabel'>
            <label>₹{0}</label>
            <b>{numberWithCommas(emi)}</b>
            <label>₹{cost}</label>
          </div>
        </div>
        <div className='inputBox'>
          <label className='main'> Tenure </label>
          <div className='tenureWrap'>
            {tenureData.map((item,index)=>{ 
              return (
                <button key={index} onClick={(e)=>{
                  e.preventDefault()
                  setTenure(item)}
                } >{item}</button>
              )
            })}
          </div>
        </div>
      </form>
    </div>
  )
}

export default App
