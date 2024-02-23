import { Redirect } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./_layout";

export default function Index(){
    return <AuthProvider>
        <Layout></Layout>
    </AuthProvider>
}