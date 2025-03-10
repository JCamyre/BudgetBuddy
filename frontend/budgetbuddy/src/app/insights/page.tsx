"use client"
import React from 'react'

const Insights = () => {
  const [collapse1, setCollapse1] = React.useState(true)
  const [collapse2, setCollapse2] = React.useState(true)
  const [collapse3, setCollapse3] = React.useState(true)
  
  return (
    <div className = "min-h-screen">
      <div className="p-8 bg-white text-green-900">
        <h1 className="text-4xl font-bold mb-8">Personalized Insights</h1>
      </div>

      <div>
        <div className = "p-8 m-8 cursor-pointer bg-green-900 hover:bg-green-700 text-white flex-auto min-w-screen max-w-screen"
            onClick={() => setCollapse1(!collapse1)}>
          Your Budget: Tips and Tricks
        </div>
        {
          (collapse1) ?
            <div></div> :
            <div className= "ml-8">Budgeting Tips</div>
        }
      </div>

      <div>
        <div className = "p-8 m-8 cursor-pointer bg-green-900 hover:bg-green-700 text-white flex-auto min-w-screen max-w-screen"
            onClick={() => setCollapse2(!collapse2)}>
          How does your spending compare to other users?
        </div>
        {
          (collapse2) ?
            <div></div> :
            <div className= "ml-8">Budgeting Tips</div>
        }
      </div>

      <div>
        <div className = "p-8 m-8 cursor-pointer bg-green-900 hover:bg-green-700 text-white flex-auto min-w-screen max-w-screen"
            onClick={() => setCollapse3(!collapse3)}>
          Additional
        </div>
        {
          (collapse3) ?
            <div></div> :
            <div className= "ml-8">Budgeting Tips</div>
        }
      </div>
    </div>
  )
}

export default Insights