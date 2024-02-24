import { Button, Modal, ScrollView, Text } from "native-base";
import React, { useEffect, useState } from "react";

const LocationPromptModal = ({
  isTermsAccepted,
  setIsTermsAccepted,
  storeData,
}) => {
  const [modalVisible, setModalVisible] = useState(!isTermsAccepted);

  useEffect(() => {
    if (isTermsAccepted) {
      storeData("@termsAccepted", true);
    }
      
    setModalVisible(!isTermsAccepted);
  }, [isTermsAccepted]);

  return (
      <Modal isOpen={modalVisible} onClose={setIsTermsAccepted} size={"md"}>
        <Modal.Content maxH="400">
          <Modal.CloseButton />
          <Modal.Header>Disclaimer</Modal.Header>
          <Modal.Body>
            <ScrollView>
            <Text>
              {
              `BloodLine collects and uses your location data to facilitate blood donation by connecting donors with recipients efficiently. We use your location to:

Find and notify you of nearby requests for blood donations.
Enable you to create requests for donations that include your current location, making it easier for nearby donors to find and reach you.

Your location is accessed even when the app is closed or not in use to ensure that you can receive timely notifications about donation requests and opportunities to help in your vicinity.

Your location is not shared with other users or third parties. It is only used to facilitate blood donation and improve the app's functionality.

By proceeding, you agree to allow BloodLine to access and use your location data for these purposes. You can change your preferences or withdraw your consent at any time and request for deletion of any data that is stored.`
              }
            </Text>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                setIsTermsAccepted(false);
                alert("You must accept the terms to proceed.");
                }}>
                  Cancel
                </Button>
                <Button onPress={() => {
                  setIsTermsAccepted(true);
                }}>
                Proceed
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
  );
}
export default LocationPromptModal;