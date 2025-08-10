/* eslint-disable import/order */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import IconDocumentLarge from "@assets/icons/KYC/icon-address-proof.svg";
import Button from "@src/components/globals/Button";
import ScreenAuth from "@src/components/globals/ScreenAuth";
import { Text } from "@src/components/libraries";
import Colors from "@src/constants/Colors";
import { renderToastError, renderToastSuccess } from "@src/hooks/useToasty";
import { kycStyles } from "@src/styles/KYC";
import { globalStyle } from "@src/styles/globals";
import { hs, ms, vs } from "@utils/design/design";
import CrossIcon from "assets/icons/close.png";
import * as DocumentPicker from "expo-document-picker";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// eslint-disable-next-line import/order
import { useBusinessUploadDocumentsMutation } from "@/store/api/business/authApis";
import { useGetCurrentBusinessQuery } from "@/store/api/business/businessCurrent";
import { useBusinessDetails } from "@/store/selectors/business/business";
import BulletPointList from "@src/components/globals/BulletPoint";
import Checkbox from "@src/components/globals/Checkbox";
import PermissionModal from "@src/components/globals/PermisisonModal";
import usePermissions from "@src/hooks/camera&mediaPermisison/usePermission";
import useBusinessLogout from "@src/hooks/useBusinessLogout";
import { useAppSelector } from "@src/hooks/useReduxHooks";
import * as FileSystem from "expo-file-system";

const Step2_Upload_ShareHolder_Documents = () => {
  const { auth_token } = useAppSelector(useBusinessDetails);
  const { refetch, isFetching } = useGetCurrentBusinessQuery(undefined, {
    skip: !auth_token,
  });
  const [businessUploadDocuments, { isLoading }] =
    useBusinessUploadDocumentsMutation();
  const [overview, setOverview] = useState<string>("");
  const [termsOn, setTermsON] = useState("off");
  const [pep, setPep] = useState<boolean>(false);
  const { handleBusinessLogout } = useBusinessLogout();
  const toggleTerms = () => {
    const newTermsState = termsOn === "off" ? "on" : "off";
    setTermsON(newTermsState);
    if (newTermsState === "on") {
      setPep(true);
    } else {
      setPep(false);
    }
  };
  const [files, setFiles] = useState<{ [index: number]: any[] }>({
    3: [], // Proof of Business Address
    4: [], // Proof of Trading
    5: [], // Incorporation Certificate
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

  useEffect(() => {
    if (hasCameraPermission === "denied") setShowCameraModal(true);
    if (hasMediaPermission === "denied") setShowMediaModal(true);
  }, [hasCameraPermission, hasMediaPermission]);
  // Document Picker
  const pickDoc = useCallback(
    async (index: number) => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: ["application/pdf"],
          copyToCacheDirectory: true,
        });

        if (result?.type === "cancel") {
          return;
        }

        const { uri, mimeType, size, name } = result.assets
          ? result.assets[0]
          : result;

        if (!uri || !mimeType || !size || !name) {
          console.error("Missing document details");
          return;
        }

        if (size > 5000000) {
          renderToastError("File selected should be under 05 MB");
          return;
        }
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const data = {
          imageType: mimeType.split("/")[1],
          image: base64,
          name,
        };

        setFiles((prevFiles) => ({
          ...prevFiles,
          [index]: [...prevFiles[index], data],
        }));
      } catch (error) {
        console.error("Error picking or processing document:", error);
      }
    },
    [setFiles]
  );
  const handleSubmit = async (filesObject: any) => {
    try {
      const selectedFiles = Object.entries(filesObject).flatMap(
        ([index, fileArray]) =>
          // eslint-disable-next-line radix
          fileArray.map((file: any) => ({ ...file, idType: parseInt(index) }))
      );
      if (selectedFiles.length > 0) {
        const fileData = selectedFiles.map((file) => ({
          base64String: file?.image,
          fileType: file?.idType,
          fileName: file?.name,
          type: `application/${file?.imageType}`,
        }));
        const response = await refetch().unwrap();
        if (!response?.data?.docsUpload2) {
          const res = await businessUploadDocuments({
            base64Strings: fileData,
            docType: 2,
            businessOverview: overview,
            pepDeclaration: pep,
          }).unwrap();
          renderToastSuccess(res?.message || "Uploaded Successfully");
        } else renderToastSuccess("Business Document Already uploaded");
      } else {
        renderToastError("No files selected for upload.");
      }
    } catch (error: any) {
      renderToastError(error?.data?.message || "Something went wrong");
    }
  };
  const bulletPoints = [
    "Politically exposed persons",
    "Head of state, Heads of Government",
    "Members of Parliament or similar bodies",
    "Members of governing bodies of political parties",
    "Politically exposed persons",
    "Head of state, Heads of Government",
    "Members of Parliament or similar bodies",
    "Members of governing bodies of political parties",
  ];
  const handleDelete = useCallback((docType, fileIndex) => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[docType] = updatedFiles[docType].filter(
        (_, index) => index !== fileIndex
      );
      return updatedFiles;
    });
  }, []);
  return (
    <ScreenAuth
      title="Share Holder Documentation"
      style={{ backgroundColor: "transparent" }}
      topColor="transparent"
      bottomColor={Colors.light.theme.backgroundTopCurveSection}
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
          Share Holder Details
        </Text>
        <Text style={kycStyles.subHeading}>
          Please upload the required documents for each Shareholder that exist
          in your Business
        </Text>
        {/* <KeyboardAwareScrollView
          bottomOffset={100}
          style={{
            flex: 1,
            paddingHorizontal: hs(0.1),
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            paddingTop: vs(0),
            flexGrow: 1,
          }}
        > */}
        <View style={styles.mainContainer}>
          <View style={{ padding: 14 }}>
            <IconDocumentLarge />
          </View>
          <View style={{ padding: 8 }}>
            <Text style={styles.headingTxt}>Proof of ID</Text>
            <Text style={styles.txt}>
              In Case of European Nationals. {"\n"} IDShould be Nationalised
            </Text>
          </View>
          <TouchableOpacity
            // disabled={files[3]?.length >= 1}
            style={[
              styles.btn,
              {
                marginLeft: hs(23),
              },
            ]}
            onPress={() => pickDoc(3)}
          >
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
        {files[3]?.map((file, index) => (
          <View key={index} style={styles.innerView}>
            <Text style={{ alignSelf: "center" }}>{file?.name}</Text>
            <TouchableOpacity
              style={{
                padding: 5,
                paddingLeft: 10,
              }}
              onPress={() => handleDelete(3, index)}
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
            <Text style={styles.headingTxt}>Proof of Address</Text>
            <Text style={styles.txt}>
              In Case of European Nationals. {"\n"} ID should be Nationalised
            </Text>
          </View>
          <TouchableOpacity
            // disabled={files[4]?.length >= 1}
            style={[
              styles.btn,
              {
                marginLeft: hs(24),
              },
            ]}
            onPress={() => pickDoc(4)}
          >
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
        {files[4]?.map((file, index) => (
          <View key={index} style={styles.innerView}>
            <Text style={{ alignSelf: "center" }}>{file?.name}</Text>
            <TouchableOpacity
              style={{
                padding: 5,
                paddingLeft: 10,
              }}
              onPress={() => handleDelete(4, index)}
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
        <View style={{ marginBottom: 30 }}>
          <View style={styles.mainContainer}>
            <View style={{ padding: 14 }}>
              <IconDocumentLarge />
            </View>
            <View style={{ padding: 8 }}>
              <Text style={styles.headingTxt}>Structure Chart</Text>
              <Text style={styles.txt}>Upload shareholder Structure chart</Text>
            </View>
            <TouchableOpacity
              // disabled={files[5]?.length >= 1}
              style={[styles.btn]}
              onPress={() => pickDoc(5)}
            >
              <Text>Upload</Text>
            </TouchableOpacity>
          </View>
          {files[5]?.map((file, index) => (
            <View key={index} style={styles.innerView}>
              <Text style={{ alignSelf: "center" }}>{file?.name}</Text>
              <TouchableOpacity
                style={{
                  padding: 5,
                  paddingLeft: 10,
                }}
                onPress={() => handleDelete(5, index)}
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
        <Text style={styles.pep}>Business Overview</Text>

        {/* <View style={{ padding: 5 }}> */}
        <TextInput
          multiline
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 15,
            textAlign: "left",
          }}
          onChangeText={(e: string) => setOverview(e)}
          placeholder="Enter here"
        />
        {/* </View> */}

        <Text style={styles.pep}>PEP Declaration</Text>
        <BulletPointList items={bulletPoints} />

        <Text style={{ padding: vs(12), fontWeight: "500" }}>
          Why do we need this information?
        </Text>
        <Text style={{ padding: vs(12), fontSize: ms(14) }}>
          It is legal requirements for all payments institution to undertake
          several checks to satisfy the requirements set by HMRC.
        </Text>
        <View style={{ marginBottom: 80 }}>
          <Checkbox
            style={{
              marginBottom: termsOn ? vs(100) : 0,
            }}
            className="justify-start"
            value={termsOn}
            onPress={() => {
              toggleTerms();
            }}
            label="PEP Declaration?"
          />
        </View>
        {/* </KeyboardAwareScrollView> */}
        <View style={kycStyles.button}>
          <Button
            btnTitle="Continue"
            disabled={!pep || !overview}
            loading={isLoading || isFetching}
            onClick={() => {
              // Validation: Check if all three document types have at least one file uploaded
              if (!files[3]?.length || !files[4]?.length || !files[5]?.length) {
                renderToastError(
                  "Please upload all required documents to proceed."
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

export default Step2_Upload_ShareHolder_Documents;
const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    backgroundColor: Colors.light.theme.eccLightWhite,
    borderRadius: 15,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginTop: vs(20),
  },
  pep: { padding: 5, fontSize: 16, fontWeight: "600" },
  btn: {
    backgroundColor: Colors.light.theme.backgroundBtnLightGray,
    borderRadius: ms(10),
    padding: ms(10),
    gap: hs(10),
  },
  innerView: {
    flexDirection: "row",
    alignSelf: "center",
    marginHorizontal: 20,
    marginBottom: 2,
    marginTop: 2,
  },
  txt: {
    fontSize: 12,
    width: "99%",
  },
  headingTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Modal background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  settingsLink: {
    marginTop: 10,
  },
});
