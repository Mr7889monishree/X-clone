import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";
import { useRouter } from "expo-router"; // ✅ import router

export const useSignOut = () => {
  const { signOut } = useClerk();
  const router = useRouter(); // ✅ get router

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();             // ✅ sign out from Clerk
          router.replace("/(auth)");         // ✅ navigate to auth screen
        },
      },
    ]);
  };

  return { handleSignOut };
};
