import { createNavigationContainerRef } from "@react-navigation/native";

import { FRIDGE } from "../constants";

export const navigationRef = createNavigationContainerRef();

// Focus the Fridge tab, which surfaces expiring/expired items.
export function navigateToExpiringProducts(): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate(FRIDGE as never);
  }
}
