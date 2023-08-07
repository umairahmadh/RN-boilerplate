import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { DemoCommunityScreen, DemoShowroomScreen, DemoDebugScreen } from "../screens"
import { DemoPodcastListScreen } from "../screens/DemoPodcastListScreen"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  
  DemoDebug: undefined
  DemoPodcastList: undefined

  NavBarRegister: { queryIndex?: string; itemIndex?: string }
  NavBarManuals: { queryIndex?: string; itemIndex?: string }
  NavBarFaultCodes: { queryIndex?: string; itemIndex?: string }
  NavBarGuides: { queryIndex?: string; itemIndex?: string }
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      {/* Screens needed: Register, Manuals, Fault Codes, Guides 
          registerScreenTab: "Register",
    manualsScreenTab: "Manuals",
    faultCodesScreenTab: "Fault Codes",
    guidesScreenTab: "Guides",

     NavBarRegister: { queryIndex?: string; itemIndex?: string }
  NavBarManuals: { queryIndex?: string; itemIndex?: string }
  NavBarFaultCodes: { queryIndex?: string; itemIndex?: string }
  NavBarGuides: { queryIndex?: string; itemIndex?: string }
    */}

      <Tab.Screen
        name="NavBarRegister"
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: translate("demoNavigator.registerScreenTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="register" color={focused && colors.palette.angry500 || !focused&& colors.palette.neutral500} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="NavBarManuals"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: translate("demoNavigator.manualsScreenTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="manual" color={focused && colors.palette.angry500 || !focused&& colors.palette.neutral500} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="NavBarFaultCodes"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: translate("demoNavigator.faultCodesScreenTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="fault" color={focused && colors.palette.angry500 || !focused&& colors.palette.neutral500} size={30} />
          ),
        }}
      />     

      <Tab.Screen
        name="NavBarGuides"
        component={DemoPodcastListScreen}
        options={{
          tabBarLabel: translate("demoNavigator.guidesScreenTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="guides" color={focused && colors.palette.angry500 || !focused&& colors.palette.neutral500} size={30} />
          ),
        }}
      />  

    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  flex: 1,
}

// @demo remove-file
