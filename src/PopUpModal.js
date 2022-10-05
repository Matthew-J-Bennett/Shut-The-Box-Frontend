import React from "react";
import PopUpContext from "./context/popup";

function PopUpModal(props) {
    let {
        displayModal,
        setDisplayModal,
        modalText,
        setModalText,
        modalTittle,
        setModalTittle,
    } = React.useContext(PopUpContext);


    function closeModal(e) {
        setDisplayModal(false)
    }


    return (<PopUpContext.Consumer>
        {(context) => {
            if (context.displayModal) {
                return (
                    <div className="PopUpModal">
                        <h1>{context.modalTittle}</h1>
                        <p>{context.modalText}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>)
            } else {
                return (<div></div>)
            }
        }
        }


    </PopUpContext.Consumer>);

}

export default PopUpModal;
