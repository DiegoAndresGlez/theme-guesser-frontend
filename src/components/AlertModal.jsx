import { useEffect } from 'react'
import { 
  Modal, 
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"

const AlertModal = ({ isOpen, onClose, message, size }) => {

  const messageWords = message ? message.split(". ") : []

  return (
    <>
      <Modal 
        size={size || "md"} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent className="bg-primary-500">
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="primary">
                <ul className='list-disc list-inside space-y-2'>
                  {messageWords.map((word, index) => (
                    <li key={index}>{word}</li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}> 
                  Continue
                </Button>
              </ModalFooter>
            </>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AlertModal;