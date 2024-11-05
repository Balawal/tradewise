import { StyleSheet } from "react-native";


export const changePasswordStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000', justifyContent: 'space-between', },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, },
    backButton: { position: 'absolute', left: 16, top: 53, },
    title: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 32 },
    form: { padding: 16, flex: 1, },
    inputContainer: { marginBottom: 20, },
    label: { color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 8, },
    input: { backgroundColor: '#312c35', borderColor: '#302938', borderWidth: 1, color: 'white', borderRadius: 12, height: 56, paddingHorizontal: 16, fontSize: 16, },
    submitButton: { backgroundColor: '#000', borderRadius: 20, paddingVertical: 8, alignItems: 'center', borderWidth: 2, borderColor: '#ad93c8', marginTop: 345 },
    submitButtonText: { color: '#ad93c8', fontSize: 15, fontWeight: 'bold', },
    loadingButton: { borderWidth: 0, },
});


export const deleteAccountStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000', justifyContent: 'space-between' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 },
    backButton: { position: 'absolute', left: 15, top: 50 },
    title: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 50 },
    content: { flexGrow: 1, justifyContent: 'flex-start', paddingHorizontal: 16, marginTop: 2 },
    heading: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', paddingBottom: 8 },
    description: { color: '#ffffff', fontSize: 16, paddingBottom: 16 },
    deleteButton: { borderColor: '#ff2400', backgroundColor: '#000', borderRadius: 20, paddingVertical: 12, alignItems: 'center', borderWidth: 2 },
    deleteButtonText: { color: '#ff2400', fontSize: 15, fontWeight: 'bold' },
    footerText: { color: '#ab9db8', fontSize: 14, textAlign: 'center', paddingVertical: 10, paddingHorizontal: 16 },
    loadingButton: { borderWidth: 0 },
});


export const settingsScreenStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', paddingTop: 20, },
    header: { fontSize: 30, color: 'white', fontWeight: 'bold', marginBottom: 20, marginTop: 40, marginLeft: 15 },
    sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingle: 40 },
    rowLabel: { fontSize: 16, color: 'white', marginLeft: 5 },
    rowText: { flexDirection: 'column', justifyContent: 'center' },
    rowValue: { color: '#ab9db8', fontSize: 14, marginLeft: 5 },
    logoutContainer: { marginTop: 145, padding: 16, },
    logoutButton: { backgroundColor: '#000', borderRadius: 20, paddingVertical: 8, alignItems: 'center', borderWidth: 2, borderColor: '#ad93c8', },
    logoutButtonText: { color: '#ad93c8', fontSize: 14, fontWeight: 'bold', },
});