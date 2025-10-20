import React from "react";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
const _layout = () => {
  return <NativeTabs>
    <NativeTabs.Trigger name="plan">
      <Label selectedStyle={{
        color: '#CD7926'
      }}>Plan</Label>
      <Icon selectedColor={'#CD7926'} src={require("../../assets/images/plan.svg")} />
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="list">
      <Label selectedStyle={{
        color: '#CD7926'
      }}>List</Label>
      <Icon selectedColor={'#CD7926'} src={require("../../assets/images/list-1.svg")} />
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="generate">
      <Label selectedStyle={{
        color: '#CD7926'
      }}>Generate</Label>
      <Icon selectedColor={'#CD7926'} src={require("../../assets/images/generate.svg")} />
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="pantry">
      <Label selectedStyle={{
        color: '#CD7926'
      }}>Pantry</Label>
      <Icon selectedColor={'#CD7926'} src={require("../../assets/images/pantry.svg")} />
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="settings">
      <Label selectedStyle={{
        color: '#CD7926'
      }} >Settings</Label>
      <Icon selectedColor={'#CD7926'} src={require("../../assets/images/settings.svg")} />
    </NativeTabs.Trigger>
  </NativeTabs>;
};

export default _layout;

