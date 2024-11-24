import { 
  Modal, 
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"

const WarningModal = ({ isOpen, onClose, message, size }) => {
  return (
    <Modal 
      size={size || "md"} 
      isOpen={isOpen} 
      onClose={onClose} 
    >
      <ModalContent className="bg-primary-500">
        <ModalHeader className="flex flex-col gap-1">Invite people to play</ModalHeader>
        <ModalBody className="primary">
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={onClose}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WarningModal;