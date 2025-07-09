// import { useClerk } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";

// export default function index() {
//   const { isSignedIn } = useClerk();
//   const router = useRouter();

//   useEffect(() => {
//     if (isSignedIn || isSignedIn) {
//       router.push("/(tabs)");
//     }
//   }, [isSignedIn, !isSignedIn]);
// }
import { useEffect } from "react";
import { useRouter, useNavigationContainerRef } from "expo-router";

export default function Index() {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("Redirecting to /tabs...");
      router.replace("/(tabs)");
    }, 100); // ⏳ Small delay ensures mounting is done

    return () => clearTimeout(timeout);
  }, []);

  return null;
}

