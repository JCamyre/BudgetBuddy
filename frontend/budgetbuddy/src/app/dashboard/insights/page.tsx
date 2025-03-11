"use client"
import React from 'react'

interface Budget {
  id?: string;
  name: string;
  spending_limit: number;
  duration: 'weekly' | 'monthly' | 'yearly';
  user_id?: string;
}

interface BudgetQuestionnaire {
  financial_situation: string;
  spending_habits: string;
  financial_goals: string;
  lifestyle_preferences: string;
  financial_concerns: string;
}

interface GoalQuestionnaire {
  current_situation: string;
  future_aspirations: string;
  risk_comfort: string;
  timeline_description: string;
  constraints: string;
}

const Insights = () => {
  const [collapse1, setCollapse1] = React.useState(true)
  const [collapse2, setCollapse2] = React.useState(true)
  
  // Add state for form data
  const [budgetForm, setBudgetForm] = React.useState({
    financial_situation: '',
    spending_habits: '',
    financial_goals: '',
    lifestyle_preferences: '',
    financial_concerns: ''
  })

  const [goalForm, setGoalForm] = React.useState({
    current_situation: '',
    future_aspirations: '',
    risk_comfort: '',
    timeline_description: '',
    constraints: ''
  })

  // Add state for API responses
  const [budgetSuggestion, setBudgetSuggestion] = React.useState<string[] | null>(null)
  const [goalSuggestions, setGoalSuggestions] = React.useState<string[]>([])
  const [isLoadingBudget, setIsLoadingBudget] = React.useState(false)
  const [isLoadingGoals, setIsLoadingGoals] = React.useState(false)
  const [error, setError] = React.useState('')

  // Form handlers
  const handleBudgetFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBudgetForm(prev => ({ ...prev, [name]: value }))
  }

  const handleGoalFormChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGoalForm(prev => ({ ...prev, [name]: value }))
  }

  const submitBudgetForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingBudget(true)
    setBudgetSuggestion(null)
    setError('')
    
    try {
      const response = await fetch('http://localhost:8000/api/suggest-budget/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetForm),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setBudgetSuggestion(data)
    } catch (err) {
      console.error('Failed to get budget suggestion:', err)
      setError('Failed to get budget suggestion. Please try again.')
    } finally {
      setIsLoadingBudget(false)
    }
  }

  const submitGoalForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingGoals(true)
    setGoalSuggestions([])
    setError('')
    
    try {
      const response = await fetch('http://localhost:8000/api/suggest-goals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalForm),
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setGoalSuggestions(data)
    } catch (err) {
      console.error('Failed to get goal suggestions:', err)
      setError('Failed to get goal suggestions. Please try again.')
    } finally {
      setIsLoadingGoals(false)
    }
  }
  
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
                To effectively manage your budget, it is essential to have a clear picture of your financial inflows and outflows. Use the budgeting tools in the app to track your income and categorize your expenses. This allows you to identify areas where you may be overspending and provides insight into your savings potential.
              </div>
              <div className = "text-sm mt-4 ml-4">
                <ul>
                    <li> Income: Include all sources like salary, freelance work, passive income.</li>
                    <li> Expenses: Categorize them into fixed (rent, utilities) and variable (entertainment, dining out).</li>
                    <li> Adjust Categories: Regularly adjust your expense categories based on changing priorities or unexpected costs.</li>
                  </ul>
              </div>

              {/* Budget Questionnaire Form */}
              <div className="mt-8 mb-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Help Us Understand Your Budget Better</h3>
                <form onSubmit={submitBudgetForm}>
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">What is your current financial situation?</label>
                    <textarea 
                      name="financial_situation"
                      value={budgetForm.financial_situation}
                      onChange={handleBudgetFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your income, savings, debt, etc."
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">What are your typical spending habits?</label>
                    <textarea 
                      name="spending_habits"
                      value={budgetForm.spending_habits}
                      onChange={handleBudgetFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="How do you usually spend your money?"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">What are your financial goals?</label>
                    <textarea 
                      name="financial_goals"
                      value={budgetForm.financial_goals}
                      onChange={handleBudgetFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your short and long-term financial objectives"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">What are your lifestyle preferences?</label>
                    <textarea 
                      name="lifestyle_preferences"
                      value={budgetForm.lifestyle_preferences}
                      onChange={handleBudgetFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your lifestyle and priorities"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-green-800 mb-2">What are your financial concerns?</label>
                    <textarea 
                      name="financial_concerns"
                      value={budgetForm.financial_concerns}
                      onChange={handleBudgetFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Any specific financial worries or challenges?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                    disabled={isLoadingBudget}
                  >
                    {isLoadingBudget ? 'Analyzing...' : 'Get Budget Suggestion'}
                  </button>
                </form>

                {/* Budget Suggestion Display */}
                {budgetSuggestion && (
                  <div className="mt-8 p-4 bg-white border border-green-300 rounded shadow-sm">
                    <h4 className="text-lg font-semibold text-green-900 mb-3">Your Suggested Budget</h4>
                    <div className="flex flex-col space-y-2">
                      <p className="text-md"><span className="font-medium">Budget Name:</span> {budgetSuggestion[0]}</p>
                      <p className="text-md"><span className="font-medium">Spending Limit:</span> ${budgetSuggestion[1]}</p>
                      <p className="text-md"><span className="font-medium">Duration:</span> {budgetSuggestion[2]}</p>
                    </div>
                    <button 
                      className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 rounded"
                      onClick={() => {
                        // Navigate to budget creation or implementation page
                        console.log('Navigate to budget creation with:', budgetSuggestion)
                      }}
                    >
                      Create This Budget
                    </button>
                  </div>
                )}
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
                    <li> Health & Fitness: You invest 10% of your budget in a premium gym membership, wellness retreats, and organic groceries, which is higher than the average person&apos;s expenditure in this category.</li>
                </ul>
              </div>
              <div className = "text-sm mt-4">
              By using Budget Buddy, you can track these spending habits and ensure you&apos;re balancing your lifestyle choices with your long-term savings and investment goals.
              </div>

              {/* Goal Questionnaire Form */}
              <div className="mt-8 mb-8 p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-green-900 mb-4">Tell Us About Your Financial Goals</h3>
                <form onSubmit={submitGoalForm}>
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">What is your current financial situation?</label>
                    <textarea 
                      name="current_situation"
                      value={goalForm.current_situation}
                      onChange={handleGoalFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your current financial position"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">What are your future aspirations?</label>
                    <textarea 
                      name="future_aspirations"
                      value={goalForm.future_aspirations}
                      onChange={handleGoalFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your long-term life and financial aspirations"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">How comfortable are you with financial risk?</label>
                    <textarea 
                      name="risk_comfort"
                      value={goalForm.risk_comfort}
                      onChange={handleGoalFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your comfort level with financial risk"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-green-800 mb-2">When do you want to achieve your goals?</label>
                    <textarea 
                      name="timeline_description"
                      value={goalForm.timeline_description}
                      onChange={handleGoalFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Describe your timeline for achieving your goals"
                    ></textarea>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-green-800 mb-2">Are there any constraints affecting your goals?</label>
                    <textarea 
                      name="constraints"
                      value={goalForm.constraints}
                      onChange={handleGoalFormChange}
                      className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                      rows={3}
                      placeholder="Any limitations or obligations affecting your goals?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                    disabled={isLoadingGoals}
                  >
                    {isLoadingGoals ? 'Analyzing...' : 'Get Goal Suggestions'}
                  </button>
                </form>

                {/* Goal Suggestions Display */}
                {goalSuggestions.length > 0 && (
                  <div className="mt-8 p-4 bg-white border border-green-300 rounded shadow-sm">
                    <h4 className="text-lg font-semibold text-green-900 mb-3">Suggested Financial Goals</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {goalSuggestions.map((goal, index) => (
                        <li key={index} className="text-md">{goal}</li>
                      ))}
                    </ul>
                    <button 
                      className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-1 px-4 rounded"
                      onClick={() => {
                        // Navigate to goal creation
                        console.log('Navigate to goal creation with:', goalSuggestions)
                      }}
                    >
                      Set These Goals
                    </button>
                  </div>
                )}
              </div>
            </div>
        }
      </div>

      {/* Error message display */}
      {error && (
        <div className="mx-8 p-4 mb-8 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}

export default Insights