/* eslint-disable import/order */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import IconDocumentLarge from '@assets/icons/KYC/icon-address-proof.svg';
import Button from '@src/components/globals/Button';
import ScreenAuth from '@src/components/globals/ScreenAuth';
import { Text } from '@src/components/libraries';
import Colors from '@src/constants/Colors';
import { renderToastError, renderToastSuccess } from '@src/hooks/useToasty';
import { kycStyles } from '@src/styles/KYC';
import { globalStyle } from '@src/styles/globals';
import { hs, ms, vs } from '@utils/design/design';
import CrossIcon from 'assets/icons/close.png';
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// eslint-disable-next-line import/order
import { useBusinessUploadDocumentsMutation } from '@/store/api/business/authApis';
import { useGetCurrentBusinessQuery } from '@/store/api/business/businessCurrent';
import { useBusinessDetails } from '@/store/selectors/business/business';
import PermissionModal from '@src/components/globals/PermisisonModal';
import usePermissions from '@src/hooks/camera&mediaPermisison/usePermission';
import useBusinessLogout from '@src/hooks/useBusinessLogout';
import { useAppSelector } from '@src/hooks/useReduxHooks';
import * as FileSystem from 'expo-file-system';

const Step1_Upload_Business_Address_Proof = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const [businessUploadDocuments, { isLoading }] =
    useBusinessUploadDocumentsMutation();
  const { handleBusinessLogout } = useBusinessLogout();
  const [files, setFiles] = useState<{ [index: number]: any[] }>({
    0: [], // Proof of Business Address
    1: [], // Proof of Trading
    2: [], // Incorporation Certificate
  });
  // Camera & Media Permission
  const {
    hasCameraPermission,
    hasMediaPermission,
    requestCameraPermissions,
    requestMediaPermissions,
  } = usePermissions();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  // useEffect(() => {
  //   if (hasCameraPermission === 'denied') setShowCameraModal(true);
  //   if (hasMediaPermission === 'denied') setShowMediaModal(true);
  // }, [hasCameraPermission, hasMediaPermission]);
  const pickDoc = useCallback(
    async (index: number) => {
      if (hasCameraPermission !== 'granted') {
        setShowCameraModal(true);
        return;
      }

      if (hasMediaPermission !== 'granted') {
        setShowMediaModal(true);
        return;
      }
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf'],
          copyToCacheDirectory: true,
        });

        if (result?.type === 'cancel') {
          return;
        }

        const { uri, mimeType, size, name } = result.assets
          ? result.assets[0]
          : result;

        if (!uri || !mimeType || !size || !name) {
          console.error('Missing document details');
          return;
        }

        if (size > 5000000) {
          renderToastError('File selected should be under 5 MB');
          return;
        }
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const data = {
          imageType: mimeType.split('/')[1],
          image: base64,
          name,
        };

        setFiles(prevFiles => ({
          ...prevFiles,
          [index]: [...prevFiles[index], data],
        }));
      } catch (error) {
        console.error('Error picking or processing document:', error);
      }
    },
    [setFiles, hasCameraPermission, hasMediaPermission],
  );
  const handleSubmit = async (filesObject: any) => {
    try {
      const selectedFiles = Object.entries(filesObject).flatMap(
        ([index, fileArray]) =>
          // eslint-disable-next-line radix
          fileArray.map((file: any) => ({ ...file, idType: parseInt(index) })),
      );
      if (selectedFiles.length > 0) {
        const fileData = selectedFiles.map(file => ({
          base64String: file?.image,
          fileType: file?.idType,
          fileName: file?.name,
          type: `application/${file?.imageType}`,
        }));
        const response = await refetch().unwrap();

        if (!response?.data?.docsUpload1) {
          const res = await businessUploadDocuments({
            base64Strings: fileData,
            docType: 1,
          }).unwrap();
          renderToastSuccess(res?.message || 'Uploaded Successfully');
        } else renderToastSuccess('Business Documents Already Uploaded');
      } else {
        renderToastError('No files selected for upload.');
      }
    } catch (error: any) {
      console.error('Error during document upload:', error);
      renderToastError(error?.data?.message || 'Something went wrong');
    }
  };
  const handleDelete = useCallback((docType, fileIndex) => {
    setFiles(prevFiles => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[docType] = updatedFiles[docType].filter(
        (_, index) => index !== fileIndex,
      );
      return updatedFiles;
    });
  }, []);
  return (
    <ScreenAuth
      title="Business Documentation"
      style={{ backgroundColor: 'transparent' }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
      darkStatus
      appBarProps={{
        light: true,
        rightIcon: true,
      }}
      back={() => {
        handleBusinessLogout();
      }}
    >
      <View style={[globalStyle.authTopCurvedCard]}>
        <PermissionModal
          showModal={showCameraModal}
          setShowModal={setShowCameraModal}
          title="We need to access your Camera to capture identity documents for verification."
          setPermission={requestCameraPermissions}
        />
        <PermissionModal
          type
          showModal={showMediaModal}
          setShowModal={setShowMediaModal}
          title="We need to access your gallery to capture identity documents for verification."
          setPermission={requestMediaPermissions}
        />

        <Text style={{ ...kycStyles.heading, marginTop: vs(16) }}>
          Business Details
        </Text>
        <Text style={kycStyles.subHeading}>
          Please upload the required documents of your Business.
        </Text>
        <ScrollView>
          <View style={styles.mainContainer}>
            <View style={{ padding: 14 }}>
              <IconDocumentLarge />
            </View>
            <View style={{ padding: 8 }}>
              <Text style={styles.headingTxt}>Proof of Business Address</Text>
              <Text style={styles.txt}>Upload Proof of Business Address</Text>
            </View>
            <TouchableOpacity
              // disabled={files[0]?.length >= 1}
              style={styles.btn}
              onPress={() => pickDoc(0)}
            >
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>
          {files[0]?.map((file, index) => (
            <View key={index} style={styles.innerView}>
              <Text style={{ alignSelf: 'center' }}>{file?.name}</Text>
              <TouchableOpacity
                style={{
                  padding: 5,
                  paddingLeft: 10,
                }}
                onPress={() => handleDelete(0, index)}
              >
                <Image
                  source={CrossIcon}
                  style={{
                    width: 15,
                    height: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
          {/* Proof of Trading */}
          <View style={styles.mainContainer}>
            <View style={{ padding: 14 }}>
              <IconDocumentLarge />
            </View>
            <View style={{ padding: 8 }}>
              <Text style={styles.headingTxt}>Proof of Trading Address</Text>
              <Text style={styles.txt}>Upload Proof of Trading Address</Text>
            </View>
            <TouchableOpacity
              // disabled={files[1]?.length >= 1}
              style={[styles.btn, { marginLeft: 8 }]}
              onPress={() => pickDoc(1)}
            >
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>

          {files[1]?.map((file, index) => (
            <View key={index} style={styles.innerView}>
              <Text style={{ alignSelf: 'center' }}>{file?.name}</Text>
              <TouchableOpacity
                style={{
                  padding: 5,
                  paddingLeft: 10,
                }}
                onPress={() => handleDelete(1, index)}
              >
                <Image
                  source={CrossIcon}
                  style={{
                    width: 15,
                    height: 15,
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
          {/* certificate */}
          <View style={{ marginBottom: 100 }}>
            <View style={styles.mainContainer}>
              <View style={{ padding: 14 }}>
                <IconDocumentLarge />
              </View>
              <View style={{ padding: 8 }}>
                <Text style={styles.headingTxt}>Incorporation Certificate</Text>
                <Text style={styles.txt}>Upload Incorporation Certificate</Text>
              </View>
              <TouchableOpacity
                // disabled={files[2]?.length >= 1}
                style={[styles.btn, { marginLeft: 10 }]}
                onPress={() => pickDoc(2)}
              >
                <Text>Upload</Text>
              </TouchableOpacity>
            </View>
            {files[2]?.map((file, index) => (
              <View key={index} style={styles.innerView}>
                <Text style={{ alignSelf: 'center' }}>{file?.name}</Text>
                <TouchableOpacity
                  style={{
                    padding: 5,
                    paddingLeft: 10,
                  }}
                  onPress={() => handleDelete(2, index)}
                >
                  <Image
                    source={CrossIcon}
                    style={{
                      width: 15,
                      height: 15,
                    }}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={kycStyles.button}>
          <Button
            btnTitle="Continue"
            disabled={
              !files[0]?.length || !files[1]?.length || !files[2]?.length
            }
            loading={isLoading || isFetching}
            onClick={() => {
              // Validation: Check if all three document types have at least one file uploaded
              if (!files[0]?.length || !files[1]?.length || !files[2]?.length) {
                renderToastError(
                  'Please upload all required documents to proceed.',
                );
                return;
              }
              handleSubmit(files);
            }}
          />
        </View>
      </View>
    </ScreenAuth>
  );
};

export default Step1_Upload_Business_Address_Proof;
const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: Colors.light.theme.eccLightWhite,
    borderRadius: 15,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: vs(20),
  },
  innerView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginHorizontal: 20,
    marginBottom: 2,
    marginTop: 2,
  },
  btn: {
    backgroundColor: Colors.light.theme.backgroundBtnLightGray,
    borderRadius: ms(10),
    padding: ms(10),
    gap: hs(10),
  },
  txt: {
    fontSize: 12,
    width: '85%',
  },
  headingTxt: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsLink: {
    marginTop: 10,
  },
});
