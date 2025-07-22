import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react"
import { Alert } from "react-native";

export const useSocialAuth=()=>{

    const [isLoading,Setisloading]=useState(false);
    const {startSSOFlow}=useSSO();


    const handleSocialAuth=async(strategy:"oauth_google" | "oauth_apple")=>{

        Setisloading(true);

        try {
            const {createdSessionId,setActive}=await startSSOFlow({strategy});
            if(createdSessionId && setActive){
                await setActive({session:createdSessionId});
            }
            
        } catch (error) {
            console.log("Error in social auth",error);
            const provider = strategy==="oauth_google"?"Google":"Apple";
            Alert.alert("Error",`Failed to sign up with ${provider}.please try again`);
            
            
        }finally{
            Setisloading(false);
        }

    }

    return {isLoading,handleSocialAuth}
}