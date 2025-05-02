import PopUp from '@components/modules/common/PopUp';

function AdminModal({ alertOpen, setModalOpen }) {
  return (
    <PopUp
      maxWidth="sm"
      fullWidth
      alertOpen={alertOpen}
      closeAlert={setModalOpen}
      title={`등록자명 modal`}
    />
  );
}

export default AdminModal;
