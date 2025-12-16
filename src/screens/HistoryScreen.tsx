import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import DirectoryDetailTemplate from "../components/DirectoryDetailTemplate";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

export default function HistoryScreen({ navigation }: Props) {
  return (
    <DirectoryDetailTemplate
      title="History"
      iconImage={require("../../assets/History-1764828807646.jpeg")}
      description="Explore the rich history of the Diocese of Tagum"
    />
  );
}
