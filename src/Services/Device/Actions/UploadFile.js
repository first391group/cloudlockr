import { Config } from "@/Config";
import BasicRequestHandler from "../Communication/BasicRequestHandler";
import {
  AddEncryptionComponent,
  SetUploadDownloadProgress,
} from "@/Store/FileTransfer";

export default UploadFile = async (
  dispatch,
  fileId,
  fileDataBlobArray,
  location
) => {
  var totalPackets = fileDataBlobArray.length;

  var requestMessage = {
    type: 3,
    fileId: fileId,
    packetNumber: undefined,
    totalPackets: totalPackets,
    location: location,
    fileData: undefined,
  };

  var curPacketNum = 1;
  var transmissionAttempts = 0;
  var localEncryptionComponent = undefined;

  // Send each of the packets of data
  while (curPacketNum <= totalPackets) {
    requestMessage.packetNumber = curPacketNum;
    requestMessage.fileData = fileDataBlobArray[curPacketNum - 1].toString();

    try {
      dispatch(
        SetUploadDownloadProgress.action({
          progress: curPacketNum / (totalPackets + 1),
          statusMessage: "uploading file",
          timeRemainingMsg: "unknown",
          indeterminate: false,
        })
      );

      const responseData = await BasicRequestHandler(requestMessage);

      if (localEncryptionComponent === undefined)
        localEncryptionComponent = responseData.localEncryptionComponent;

      // Update transmission state
      curPacketNum++;
      if (transmissionAttempts !== 0) transmissionAttempts = 0;
    } catch (err) {
      // Check if the device rejected the transmission. Retry if so
      if (err.includes("Request with id")) {
        transmissionAttempts++;

        // Prevent continuous reattempts
        if (transmissionAttempts === Config.device.maxTransmissionAttempts) {
          throw "Too many transmission attempts";
        }

        continue;
      }

      // Otherwise send the error upwards
      throw err;
    }
  }

  // Store the localEncryptionComponent
  dispatch(
    AddEncryptionComponent.action({
      fileId: fileId,
      value: localEncryptionComponent,
    })
  );
};
