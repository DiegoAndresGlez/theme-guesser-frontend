import { useState, useEffect } from 'react'
import { 
  Modal, 
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"

import PropTypes from 'prop-types'

const AlertModal = ({ isOpen, onClose, message, size }) => {
  // const {isOpen, onOpen, onClose} = useDisclosure();
  // const [isOpen, setIsOpen] = useState(false)

  // const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "full"];

  useEffect(() => {
    if (isOpen) {
      console.log("Modal is open")
    }
  }, [isOpen])

  return (
    <>
      <Modal 
        size={size} 
        isOpen={isOpen} 
        onClose={onClose} 
      >
        <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <p>
                  { message }
                </p> 
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
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