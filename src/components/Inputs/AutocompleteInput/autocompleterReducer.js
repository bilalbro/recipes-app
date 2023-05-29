async function loadData(data, dispatchForAutocompleter, dispatchForSuggestionsBox)
{
   if (data instanceof Promise) {
      var loadedData = await data;
      dispatchForAutocompleter({
         type: 'dataLoad',
         data: loadedData,
         dispatchForSuggestionsBox
      });
   }
}



/*******************************************************************************
Reducer
*******************************************************************************/
export default function autocompleterReducer(state, action)
{
   switch (action.type) {
      case 'init':
         return {
            ...state,
            value: action.value,
         };

      case 'input':
         return {
            ...state,
            value: action.value,
            hiddenValue: action.value
         };

      case 'inputBlur':
         const firstSuggestion = action.suggestions[0];
         if (
            firstSuggestion &&
            state.getInputValue(firstSuggestion).toLowerCase() === action.value.toLowerCase()
         ) {
            return {
               ...state,
               hiddenValue: state.getHiddenInputValue(firstSuggestion)
            }
         }
         return state;

      case 'entryClick':
         if (action.suggestion) {
            return {
               ...state,
               value: state.getInputValue(action.suggestion),
               hiddenValue: state.getHiddenInputValue(action.suggestion)
            }
         }

      case 'inputFocus':
         if (state.data instanceof Promise) {
            loadData(state.data, action.dispatchForAutocompleter, action.dispatchForSuggestionsBox);
         }
         return state;

      case 'dataLoad':
         action.dispatchForSuggestionsBox({
            type: 'input',
            value: state.value,
            data: action.data
         });
         return {
            ...state,
            data: action.data
         }

      default:
         return state;
   }
}