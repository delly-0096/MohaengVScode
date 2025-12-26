import { useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

function Modal({ isOpen, onClose, title, children, size = 'medium', footer }) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large'
  }[size] || 'modal-medium';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <RiCloseLine />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// 확인 모달 컴포넌트
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = '확인', cancelText = '취소', type = 'primary' }) {
  const buttonClass = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    warning: 'btn-warning'
  }[type] || 'btn-primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>{cancelText}</button>
          <button className={`btn ${buttonClass}`} onClick={onConfirm}>{confirmText}</button>
        </>
      }
    >
      <p style={{ textAlign: 'center', padding: '1rem 0' }}>{message}</p>
    </Modal>
  );
}

export { Modal, ConfirmModal };
export default Modal;
