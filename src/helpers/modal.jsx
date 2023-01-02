import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useOverlayFunctions } from './overlay';

var setModal = null;


export function useModal()
{
   const [showOverlay, hideOverlay] = useOverlayFunctions(() => {}, hideModal);

   function showModal({title, body}) {
      setModal({title, body});
      showOverlay();
   }

   function hideModal() {
      setModal(null);
   }

   return {
      showModal,

      // When a piece of code wants to hide the modal, it actually hides the 
      // overlay, which in this case is configured to automatically hide the 
      // modal as well. Think out of the box!
      hideModal: hideOverlay
   };
}

function ModalBox({
   content
})
{
   const { hideModal } = useModal();

   const keyDownHandler = useCallback((e) => {
      if (e.keyCode === 27) {
         hideModal();
      }
   }, []);
   const modalDivElement = useRef();

   useEffect(() => {
      window.addEventListener('keydown', keyDownHandler);
      return () => {
         window.removeEventListener('keydown', keyDownHandler);
      }
   }, []);

   useEffect(() => {
      var inputElement = modalDivElement.current.querySelector('input[type="text"]');
      if (inputElement) {
         inputElement.focus();
      }
   });

   return (
      <div ref={modalDivElement} className="modal">
         <h3 className="modal_head">{content.title}</h3>
         {content.body}
      </div>
   );
}


export function Modal()
{
   const [modal, _setModal] = useState(null);

   useEffect(() => {
      setModal = _setModal;
   }, []);

   return (
      modal
      ? <ModalBox content={modal} />
      : null
   );
}