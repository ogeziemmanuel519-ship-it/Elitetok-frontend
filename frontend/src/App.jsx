import React, { useState } from "react"
import axios from "axios"

const API = "https://elitetok-1.onrender.com"

export default function App() {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [token,setToken]=useState("")
  const [points,setPoints]=useState(0)
  const [video,setVideo]=useState("")
  const [ref,setRef]=useState("")

  const signup=async()=>{
    const r=await axios.post(API+"/signup",{email,password,ref})
    alert("Signup success")
  }

  const login=async()=>{
    const r=await axios.post(API+"/login",{email,password})
    setToken(r.data.token)
    setPoints(r.data.points)
  }

  const analyze=async()=>{
    const r=await axios.post(API+"/analyze",
      {video},
      {headers:{Authorization:token}}
    )
    alert(JSON.stringify(r.data))
  }

  return (
    <div style={{padding:20,fontFamily:"sans-serif"}}>

      <h1>EliteTok</h1>

      <h3>Signup / Login</h3>

      <input placeholder="email"
        onChange={e=>setEmail(e.target.value)} />
      <br/>

      <input placeholder="password"
        type="password"
        onChange={e=>setPassword(e.target.value)} />
      <br/>

      <input placeholder="referral code"
        onChange={e=>setRef(e.target.value)} />
      <br/>

      <button onClick={signup}>Signup</button>
      <button onClick={login}>Login</button>

      <h3>Points: {points}</h3>

      <h3>Analyze Video</h3>

      <input placeholder="Video URL"
        onChange={e=>setVideo(e.target.value)} />

      <button onClick={analyze}>
        Analyze
      </button>

      <h3>Buy 100 Points (£10)</h3>

      <a href="https://ko-fi.com/elitetok">
        <button>Pay Now</button>
      </a>

    </div>
  )
}