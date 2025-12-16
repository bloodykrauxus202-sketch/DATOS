import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import DirectoryScreen from "../screens/DirectoryScreen";
import ParishScreen from "../screens/ParishScreen";
import ParishDetailScreen from "../screens/ParishDetailScreen";
import BECScreen from "../screens/BECScreen";
import BECDetailScreen from "../screens/BECDetailScreen";
import PriestScreen from "../screens/PriestScreen";
import MinistryScreen from "../screens/MinistryScreen";
import LayMovementScreen from "../screens/LayMovementScreen";
import VicariateScreen from "../screens/VicariateScreen";
import SchoolsScreen from "../screens/SchoolsScreen";
import SchoolDetailScreen from "../screens/SchoolDetailScreen";
import CongregationScreen from "../screens/CongregationScreen";
import CongregationDetailScreen from "../screens/CongregationDetailScreen";
import CorporationsScreen from "../screens/CorporationsScreen";
import CorporationDetailScreen from "../screens/CorporationDetailScreen";
import HistoryScreen from "../screens/HistoryScreen";
import { ParishDetails, SchoolDetails, CorporationDetails, CongregationDetails, BECDetails } from "../api/googleSheets";

export type RootStackParamList = {
  Welcome: undefined;
  Directory: undefined;
  Parish: undefined;
  ParishDetail: { parish: ParishDetails };
  BEC: undefined;
  BECDetail: { bec: BECDetails };
  Priest: undefined;
  Ministry: undefined;
  LayMovement: undefined;
  Vicariate: undefined;
  Schools: undefined;
  SchoolDetail: { school: SchoolDetails };
  Congregation: undefined;
  CongregationDetail: { congregation: CongregationDetails };
  Corporations: undefined;
  CorporationDetail: { corporation: CorporationDetails };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#ffffff" },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Directory" component={DirectoryScreen} />
      <Stack.Screen name="Parish" component={ParishScreen} />
      <Stack.Screen name="ParishDetail" component={ParishDetailScreen} />
      <Stack.Screen name="BEC" component={BECScreen} />
      <Stack.Screen name="BECDetail" component={BECDetailScreen} />
      <Stack.Screen name="Priest" component={PriestScreen} />
      <Stack.Screen name="Ministry" component={MinistryScreen} />
      <Stack.Screen name="LayMovement" component={LayMovementScreen} />
      <Stack.Screen name="Vicariate" component={VicariateScreen} />
      <Stack.Screen name="Schools" component={SchoolsScreen} />
      <Stack.Screen name="SchoolDetail" component={SchoolDetailScreen} />
      <Stack.Screen name="Congregation" component={CongregationScreen} />
      <Stack.Screen name="CongregationDetail" component={CongregationDetailScreen} />
      <Stack.Screen name="Corporations" component={CorporationsScreen} />
      <Stack.Screen name="CorporationDetail" component={CorporationDetailScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
