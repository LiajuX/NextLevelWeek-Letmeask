import ReactModal from 'react-modal';

import '../styles/modal.scss';

type ModalProps = {
  icon: string;
  title: string;
  subtitle: string;
  confirmButtonText: string;
  isOpened: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function Modal({ 
  icon, 
  title, 
  subtitle, 
  confirmButtonText,
  isOpened = false,
  onCancel,
  onConfirm,
}: ModalProps) {
  return (
    <div>
      <ReactModal 
        isOpen={isOpened} 
        className="modal"
        overlayClassName="overlay"
      >
        <div>
          <img src={icon} alt={title} />
        </div>

        <h2>{ title }</h2>
        <p>{ subtitle }</p>

        <div className="buttons-container">
          <button 
            className="cancel-button" 
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button 
            className="confirm-button" 
            type="button" 
            onClick={onConfirm}
          >
            { confirmButtonText }
          </button>
        </div>
      </ReactModal>
    </div>
  );
}
