// hooks/usePermissions.ts
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

const usePermissions = () => {
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [mediaPermissionChecked, setMediaPermissionChecked] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<string | null>(
    null,
  );
  const [hasMediaPermission, setHasMediaPermission] = useState<string | null>(
    null,
  );

  const requestCameraPermissions = async () => {
    const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();

    // Show native system prompt if permission hasn't been checked yet
    if (!permissionChecked && canAskAgain) {
      const { status: requestStatus } =
        await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(requestStatus);
    } else {
      setHasCameraPermission(status);
    }

    setPermissionChecked(true);
  };

  const requestMediaPermissions = async () => {
    const { status, canAskAgain } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    // Show native system prompt if permission hasn't been checked yet
    if (!mediaPermissionChecked && canAskAgain) {
      const { status: requestStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasMediaPermission(requestStatus);
    } else {
      setHasMediaPermission(status);
    }

    setMediaPermissionChecked(true);
  };

  useEffect(() => {
    requestCameraPermissions();
    requestMediaPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    permissionChecked,
    mediaPermissionChecked,
    hasCameraPermission,
    hasMediaPermission,
    requestCameraPermissions,
    requestMediaPermissions,
  };
};
export default usePermissions;
