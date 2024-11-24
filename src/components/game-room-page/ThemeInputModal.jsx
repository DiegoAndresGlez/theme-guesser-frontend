import { useEffect, useState} from 'react'
import { 
  Input,
  Modal, 
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@nextui-org/react"

const ThemeInputModal = ({ isOpen, onSubmit, size }) => {
  const [theme, setTheme] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingWords, setIsGeneratingWords] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTheme('');
      setIsSubmitting(false);
      setIsGeneratingWords(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!theme.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setIsGeneratingWords(true);
    
    try {
      await onSubmit(theme);
      setTheme('');
    } catch (error) {
      console.error('Failed to submit theme:', error);
      setIsGeneratingWords(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThemeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setTheme(value);
    }
  };

  const isValid = theme.trim().length > 0 && theme.length <= 20;

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      hideCloseButton={true}
      isDismissable={false}
      shouldBlockScroll={true}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent className="bg-primary-500">
        {isGeneratingWords ? (
          <div className="p-8 flex flex-col items-center justify-center gap-4">
            <Spinner type="points" size="lg" color="secondary"/>
            <p className="text-center text-white">
              Generating words for your theme...
            </p>
          </div>
        ) : (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Enter Your Theme
            </ModalHeader>
            
            <ModalBody className="primary space-y-4">
              <Input
                color="primary"
                label="Theme"
                placeholder="e.g., Animals, Sports, Food"
                value={theme}
                onChange={handleThemeChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid) handleSubmit();
                }}
                disabled={isSubmitting}
                description={`${theme.length}/20 characters`}
                isInvalid={theme.length > 20}
                errorMessage={theme.length > 20 ? "Theme must be 20 characters or less" : ""}
              />
              
              <div className="text-sm text-white-400">
                <p>Choose a broad theme that others can draw and guess from.</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Keep it simple and clear.</li>
                  <li>Avoid very specific themes for fun and dynamic words.</li>
                  <li>Make sure it is drawable.</li>
                </ul>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Theme'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
  
export default ThemeInputModal;