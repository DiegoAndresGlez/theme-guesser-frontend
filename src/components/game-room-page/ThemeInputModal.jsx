import { useEffect, useState} from 'react'
import { 
  Input,
  Modal, 
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react"

const ThemeInputModal = ({ isOpen, onSubmit, onClose, size }) => {
  const [theme, setTheme] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTheme('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!theme.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(theme);
      setTheme('');
    } catch (error) {
      console.error('Failed to submit theme:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      hideCloseButton={true} // Hide the X button
      isDismissable={false} // Prevent closing on backdrop click
      shouldBlockScroll={true} // Prevent scrolling while open
      isKeyboardDismissDisabled={true} // Prevent escape key from closing
    >
      <ModalContent className="bg-primary-500">
        <>
          <ModalHeader className="flex flex-col gap-1">
            Enter Your Theme
          </ModalHeader>
          
          <ModalBody className="primary space-y-4">
            <Input
              label="Theme"
              placeholder="e.g., Animals, Sports, Food"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              disabled={isSubmitting}
            />
            
            <div className="text-sm text-white-400">
              <p>Choose a broad theme that others can draw and guess from.</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Keep it simple and clear.</li>
                <li>Avoid very specific themes for fun and dynamic words.</li>
                <li>Make sure it's drawable.</li>
              </ul>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="secondary"
              onPress={handleSubmit}
              disabled={!theme.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Theme'}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
  
  export default ThemeInputModal;