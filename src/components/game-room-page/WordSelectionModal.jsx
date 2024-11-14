import { useEffect, useState} from 'react'
import { 
  Modal, 
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react"
import { GameRoomState } from '../../utils/GameRoomState';

const WordSelectionModal = ({
    isOpen,
    size,
    roomData,
    socket,
    onWordSelect,
    onClose,
}) => {
    const [wordChoices, setWordChoices] = useState([])

    // Get and set random words when modal opens
    useEffect(() => {
        if (isOpen && roomData?.wordsList?.length > 0) {
            // Get 3 random words from wordsList
            const available = [...roomData.wordsList];
            const selected = [];

            while (selected.length < 3 && available.length > 0) {
                const randomIndex = Math.floor(Math.random() * available.length);
                selected.push(available.splice(randomIndex, 1)[0]);
            }

            setWordChoices(selected);
        }
    }, [isOpen, roomData?.wordsList]);

    const handleWordSelect = (selectedWord) => {
        // Pass both selected word and all shown words
        onWordSelect(selectedWord, wordChoices);
    };


    return (
        <Modal
            size={size}
            isOpen={isOpen}
            hideCloseButton={true}
            isDismissable={false}
            shouldBlockScroll={true}
            isKeyboardDismissDisabled={true}
            onClose={onClose}
        >
            <ModalContent className="bg-primary-500">
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-white text-center">
                            Choose a Word to Draw!
                        </h3>
                    </ModalHeader>

                    <ModalBody className="space-y-4 pb-6">
                        {wordChoices.map((word, index) => (
                            <Button
                                key={index}
                                className="w-full h-14 text-lg font-medium capitalize bg-white hover:bg-opacity-90"
                                onClick={() => handleWordSelect(word)}
                            >
                                {word}
                            </Button>
                        ))}
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
};

export default WordSelectionModal;