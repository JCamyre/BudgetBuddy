"use client"
import React from 'react'

const Insights = () => {
  const [collapse1, setCollapse1] = React.useState(true)
  const [collapse2, setCollapse2] = React.useState(true)
  const [collapse3, setCollapse3] = React.useState(true)

  const [which1, setWhich1] = React.useState(0)
  const [which2, setWhich2] = React.useState(0)
  
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
            <div className= "ml-8 mr-8">
              <div className = "text-lg">Track Your Income and Expenses</div>
              <div className = "text-sm mt-4">
                To effectively manage your budget, it’s essential to have a clear picture of your financial inflows and outflows. Use the budgeting tools in the app to track your income and categorize your expenses. This allows you to identify areas where you may be overspending and provides insight into your savings potential.
              </div>
              <div className = "text-sm mt-4 ml-4">
                <ul>
                    <li> Income: Include all sources like salary, freelance work, passive income.</li>
                    <li> Expenses: Categorize them into fixed (rent, utilities) and variable (entertainment, dining out).</li>
                    <li> Adjust Categories: Regularly adjust your expense categories based on changing priorities or unexpected costs.</li>
                  </ul>
              </div>
            </div>
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
            <div className= "ml-8 mr-8">
              <div className = "text-lg">Your Spending Patterns Compared to the Average Person</div>
              <div className = "text-sm mt-4">
              As a professional with a stable income in the tech industry, your spending habits differ from the average person due to your higher disposable income and focus on experiences rather than material goods. While most people allocate a large portion of their budget to basic living expenses like utilities and transportation, you spend more on travel, wellness, and premium services.
              </div>
              <div className = "text-sm mt-4 ml-4">
                <ul>
                    <li> Travel: You spend 20% of your annual budget on travel, prioritizing international vacations and weekend getaways.</li>
                    <li> Dining & Experiences: You allocate 15% to dining out, exploring trendy restaurants, and attending events like concerts and art shows.</li>
                    <li> Health & Fitness: You invest 10% of your budget in a premium gym membership, wellness retreats, and organic groceries, which is higher than the average person’s expenditure in this category.</li>
                </ul>
              </div>
              <div className = "text-sm mt-4">
              By using Budget Buddy, you can track these spending habits and ensure you’re balancing your lifestyle choices with your long-term savings and investment goals.
              </div>
            </div>
        }
      </div>

    </div>
  )
}

export default Insights