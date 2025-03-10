# Data Viewer App - README

Live Demo:- https://dataviewerapp.onrender.com/

Video Tutorial:- https://www.youtube.com/watch?v=fiWxmCrM2Ng

## A. Instructions for Running and Testing

1. ** Install Dependencies **  
   ```bash
   npm install

2. ** Run in Development **
   ```bash
   npm start

3. ** Build for Production **
   ```bash
   npm run build

4. ** Test **
   Currently, there are no automated tests configured.
   If tests were included (e.g., Jest or React Testing Library), you would run them via:
   ```bash
   npm test
  For now, you can manually verify the features by launching the app and interacting with the Store, SKU, Planning, and Chart pages.

Challenge Elements Done Well:-

1. React + Redux Structure

- The application uses React with Redux for state management.
- I organized the slices (stores, skus, planning) in a way that keeps data flows clean and consistent.

2. Pivoting and Aggregation Logic

- Implemented a pivot function that cross-joins raw planning data with SKU data to compute Sales Dollars, GM Dollars, and GM %.
- This logic shows an ability to handle transformations and computations in a maintainable way.
  
3. Dynamic AG Grid Configuration

- The Planning screen builds column groups by months/weeks, leveraging AG Grid for advanced features like conditional styling, grouping, and editing.
- This demonstrates proficiency in AG Grid usage and dynamic column definitions.
  
4. Chart Page (Dual-Axis Bar/Line)

- A Recharts-based dual-axis chart aggregates GM Dollars and Sales Dollars, then calculates GM % for a selected store.
- This highlights front-end data visualization skills and the ability to handle user interactions (selecting a store).
  
These elements demonstrate proficiency because they tackle both data transformation (pivoting, aggregation) and UI complexity (grouped columns, dynamic charting) while maintaining a clean structure in Redux and React.

Potential Improvements (With 4 More Hours):- 

1. Unit & Integration Tests

- Implement Jest or React Testing Library tests for key components (Store, SKU, Planning) and for pivot logic.
- Ensures reliability and demonstrates a test-driven mindset.
  
2. More Robust Error Handling & Logging

- Add user-friendly error messages if data import fails or if a calculation encounters unexpected values.
- Log warnings and errors to the console or a logging service for debugging in production.
  
3. Improved UI/UX

- Use a polished component library (e.g., Material UI) for more consistent styling, tooltips, and user feedback.
- Make the AG Grid fully responsive for smaller screens and refine the chart’s tooltips/legend for clarity.
  
I would do these improvements to strengthen the application’s reliability, maintainability, and user experience, which are key aspects in production-ready software.
