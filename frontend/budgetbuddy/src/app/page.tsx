import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-r from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-4">
            Welcome to BudgetBuddy
          </h1>
          <p className="text-lg text-green-700 mb-6">
            Your personal finance assistant to help you manage expenses, set goals, and gain insights.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-green-900 text-center mb-8">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-4xl mb-4">💰</div> 
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Expense Tracking
            </h3>
            <p className="text-base text-green-700">
              Capture and upload receipt photos to track expenses automatically. Add, edit, and delete expenses manually.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Budget Management
            </h3>
            <p className="text-base text-green-700">
              Create monthly and category-based budgets. Receive alerts when nearing or exceeding budget limits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="text-4xl mb-4">🤖</div> 
            <h3 className="text-xl font-bold text-green-900 mb-2">
              AI-Powered Insights
            </h3>
            <p className="text-base text-green-700">
              Receive AI-driven recommendations to improve savings and cut unnecessary expenses.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-green-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-base text-green-700 italic">
                &quot;BudgetBuddy has completely changed the way I manage my finances. It&apos;s so easy to use!&quot;
              </p>
              <p className="text-green-900 font-semibold mt-4">- Jane Doe</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-base text-green-700 italic">
                &quot;The AI insights are incredibly helpful. I&apos;ve saved so much money since I started using BudgetBuddy.&quot;
              </p>
              <p className="text-green-900 font-semibold mt-4">- John Smith</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow duration-300">
              <p className="text-base text-green-700 italic">
                &quot;I love how I can track my expenses and set financial goals all in one place.&quot;
              </p>
              <p className="text-green-900 font-semibold mt-4">- Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-green-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-green-100 text-base">
            &copy; {new Date().getFullYear()} BudgetBuddy. All rights reserved.
          </p>
          <div className="mt-4">
            <Link href="/login" className="text-green-100 hover:text-green-200 mx-3 text-base">
              Log In
            </Link>
            <Link href="/signup" className="text-green-100 hover:text-green-200 mx-3 text-base">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}