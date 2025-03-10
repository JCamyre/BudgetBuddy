import React from 'react'

const Insights = () => {
  return (
    <div className = "min-h-screen">
      <div className="p-8 bg-white text-green-900">
        <h1 className="text-4xl font-bold mb-8">Personalized Insights</h1>
      </div>

      <div className = "p-8 m-8 cursor-pointer bg-green-900 hover:bg-green-700 text-white flex-auto min-w-screen max-w-screen">
        Budgeting Tips
        <div className="collapse bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">How do I create an account?</div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the registration process.
          </div>
        </div>
      </div>
      <div className = "p-8 m-8 cursor-pointer bg-green-900 hover:bg-green-700 text-white flex-auto min-w-screen max-w-screen">test block 1</div>
      <div className = "p-8 m-8 cursor-pointer bg-green-900 hover:bg-green-700 text-white flex-auto min-w-screen max-w-screen">test block 1</div>
      
    </div>
  )
}

export default Insights