# personal-finance-tracker

## Test scenarios

# Navbar Visibility
**Expected outcome:**  
The navigation bar only becomes visible when the user is logged in; attempting to navigate to a route such as `/expenses`, for example, gives an error when a user attempts to access it in a logged-out state.  

**Success indicator:**  
- A user is logged out. The "Expenses and Budget" header has not been rendered.  
- A user is logged in. The "Expenses and Budget" header has been rendered.  

**Failure indicator:**  
- A user is logged out. The "Expenses and Budget" header has been rendered.  
- A user is logged in. The "Expenses and Budget" header has not been rendered.  

---

# Budget Suggestions
**Expected outcome:**  
Pass in an example budget questionnaire and return a budget plan that is tailored towards the questionnaire’s answers.  

**Success indicator:**  
- The budget plan closely matches the expected budget plan that we wrote (using a golden example made by human experts, us! 😊)  

**Failure indicator:**  
- The budget plan diverges from the expected budget plan, either suggesting an outrageously high or low budget depending on the user’s situation.  

---

# Goal Suggestions
**Expected outcome:**  
Pass in an example goal questionnaire and return financial goals for the user, tailored towards the questionnaire’s answers.  

**Success indicator:**  
- The financial goals closely mirror the expected goal questionnaire that we wrote (using a golden example).  

**Failure indicator:**  
- The financial goals are unrelated or contradict the user’s answers.  

---

# Receipt Example
**Expected outcome:**  
When a receipt image is passed in with the expected text (in JSON format), the parser function should extract the correct text.  

**Success indicator:**  
- The function outputs the actual text from the receipt.  

**Failure indicator:**  
- The function either returns no text or incorrect text (doesn’t match the actual text on the receipt, which we wrote out into a static JSON).  
