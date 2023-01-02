import React, { useEffect, useRef } from 'react';
import {classNames} from '../../../components/helper';


function isElementInViewport(element)
{
   var rect = element.getBoundingClientRect();

   return (
      (rect.top > 0 && rect.top < innerHeight)
      && (rect.bottom < innerHeight)
   );
}

function isElementInParent(element, parent)
{
   var elementOffsetTop = (element.offsetTop - parent.scrollTop);
   var elementOffsetBottom = parent.offsetHeight - (elementOffsetTop + element.offsetHeight);

   return [
      (0 <= elementOffsetTop) && (0 <= elementOffsetBottom),
      (elementOffsetTop < 0) ? elementOffsetTop : -elementOffsetBottom
   ];
}


export default function SuggestionsBox({
   autocompleter,
   dispatchForAutocompleter,
   suggestionsBox,
   dispatchForSuggestionsBox
})
{
   const {data, value} = autocompleter;
   const {
      suggestions,
      entrySelected,
      isShown,
      noMatchText,
      getSuggestionValue
   } = suggestionsBox;
   const suggestionsBoxElement = useRef();

   useEffect(() => {
      if (entrySelected !== -1) {
         const selectedSuggestionElement =
            suggestionsBoxElement.current
            .querySelectorAll('.autocomplete_suggestion')[entrySelected];

         if (!isElementInViewport(suggestionsBoxElement.current)) {
            suggestionsBoxElement.current.scrollIntoView({block: 'center'});
         }

         const [elementIsVisible, additionalScrollTop] =
            isElementInParent(selectedSuggestionElement, suggestionsBoxElement.current);

         if (!elementIsVisible) {
            suggestionsBoxElement.current.scrollTop += additionalScrollTop;
         }
      }
   }, [entrySelected]);


   function onMouseDown(e) { e.preventDefault(); }

   function onSuggestionClick(i, suggestion)
   {
      dispatchForAutocompleter({
         type: 'entryClick',
         entryClicked: i,
         suggestion
      });
      dispatchForSuggestionsBox({
         type: 'entryClick'
      });
   }
   
   return isShown && (
      <div ref={suggestionsBoxElement} className="autocomplete_suggestions-box" onMouseDown={onMouseDown}>
         {
         data instanceof Promise
         ? <div className="autocomplete_text">Loading...</div>
         :
            suggestions.length
            ? suggestions.map((suggestion, i) => (
               <div key={i} onClick={() => onSuggestionClick(i, suggestion)} className={classNames({
                  'autocomplete_suggestion': true,
                  'autocomplete_suggestion--sel': i === entrySelected,
               })}>{getSuggestionValue(suggestion)}</div>
            ))
            : (
               <div className="autocomplete_text">
                  {typeof noMatchText === 'function' ? noMatchText(value) : noMatchText}
               </div>
            )
         }
      </div>
   );
}