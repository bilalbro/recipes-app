function handleInput(state, value, data)
{
   if (data instanceof Promise) {
      return [];
   }
   return data.filter(state.filterFunction.bind(null, value));
}


function handleNavigation(state, direction)
{
   const suggestions = state.suggestions;
   var entrySelected = state.entrySelected;

   if (!suggestions.length) {
      return -1;
   }

   if (direction === 'down') {
      entrySelected = (suggestions.length - 1 === entrySelected) ? -1 : entrySelected + 1;
   }
   else {
      entrySelected = entrySelected === -1 ? suggestions.length - 1 : entrySelected - 1;
   }

   return entrySelected;
}



/*******************************************************************************
Reducer
*******************************************************************************/
export default function suggestionsBoxReducer(state, action)
{
   switch (action.type) {
      case 'input':
         var isShown = true;
         if (action.value === '' && !state.allOnEmpty) {
            isShown = false;
         }
         return {
            ...state,
            isShown,
            entrySelected: -1,
            suggestions: handleInput(state, action.value, action.data)
         };
      case 'navigation':
         return {
            ...state,
            entrySelected: handleNavigation(state, action.direction)
         }
      case 'inputBlur':
      case 'entryClick':
      case 'escPress':
         return {
            ...state,
            entrySelected: -1,
            isShown: false
         }
      case 'inputFocus':
         var isShown = true;
         if (action.value === '' && !state.allOnEmpty) {
            isShown = false;
         }
         return {
            ...state,
            suggestions: handleInput(state, action.value, action.data),
            isShown
         }
      case 'dataLoad':
         return {
            ...state,
            suggestions: handleInput(state, action.value, action.data)
         }
   }
}