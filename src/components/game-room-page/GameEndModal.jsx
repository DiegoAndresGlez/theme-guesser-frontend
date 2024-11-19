import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";

const GameEndModal = ({ isOpen, result, onClose }) => {
  return (
    <Modal
      size="md"
      isOpen={isOpen}
      hideCloseButton={true}
      isDismissable={false}
      shouldBlockScroll={true}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent className="bg-primary-500">
        <ModalHeader className="flex flex-col gap-1 items-center justify-center">
          {result?.type === 'tie' ? (
            <span className="font-heading text-6xl font-bold">It's a tie!</span>
          ) : (
            <span className="font-heading text-6xl font-bold">🎉 Winner! 🎉</span>
          )}
        </ModalHeader>
        
        <ModalBody className="primary space-y-2">
          {result?.type === 'winner' && (
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold">{result.player.username}</p>
              <p className="text-lg">{result.player.score} points</p>
            </div>
          )}
          
          <div className="flex justify-center pt-4">
            <Button
              color="secondary"
              onPress={onClose}
              className="px-8"
            >
              Close
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GameEndModal;