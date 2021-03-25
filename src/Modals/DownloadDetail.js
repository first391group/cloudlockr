import React, { useState } from 'react';
import {
    Text,
    View
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { InputField, Button } from '@/Components'
import SetDetails from '@/Store/FileTransfer/SetDetails'
import { useTheme } from '@/Theme'

const DownloadDetail = (props) => {
    const { Layout, Fonts, Gutters, Colors } = useTheme();
    const dispatch = useDispatch();

    const requestCallback = props.requestCallback;

    var downloadInfo = useSelector((state) => state.fileTransfer).details;
    var encrpytionComponents = useSelector((state) => state.fileTransfer).encrpytionComponents;

    const [password, setPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [buttonsEnabled, setButtonsEnabled] = useState(false); 

    const passwordCallback = (returnedPassword) => {
        setPassword(returnedPassword);
        if (accessCode !== '')
            setButtonsEnabled(true);
    }
    
    const accessCodeCallback = (returnedCode) => {
        setAccessCode(returnedCode);
        if (password !== '')
            setButtonsEnabled(true);
    }

    const downloadCallback = () => {
        // Save the updated file details so that the localEncrpytionComponent is stored
        if (encrpytionComponents !== undefined) {
            var component = encrpytionComponents[downloadInfo.id];
            downloadInfo.localEncrpytionComponent = component;
            dispatch(SetDetails.action(downloadInfo));
        }

        requestCallback('download', accessCode, password, downloadInfo.id);
    }

    const deleteCallback = () => {
        requestCallback('delete', accessCode, password, downloadInfo.id);
    }

    return (
        <View style={[Layout.column, Layout.alignItemsCenter, Gutters.largexlHPadding]} >
            <Text style={[Fonts.detailFileName, Gutters.regularxlVPadding]}>access {downloadInfo.fileName}</Text>
            <View style={[Layout.column, Layout.alignItemsCenter, Layout.justifyContentBetween, {height: 190}]}>
                <InputField placeholder={"device password"} hideInput useLightInput finishEditingCallback={passwordCallback} />
                <InputField placeholder={"displayed device access code"} useLightInput finishEditingCallback={accessCodeCallback} />
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                    <Button title={"download"} color={Colors.secondary} style={[Gutters.regularRPadding, {flex: 2}]} setEnabled={buttonsEnabled} clickCallback={downloadCallback} />
                    <Button title={"delete"} color={Colors.red} style={{flex: 1}} setEnabled={buttonsEnabled} clickCallback={deleteCallback} />
                </View>
            </View>
        </View>
    );
}

export default DownloadDetail;
