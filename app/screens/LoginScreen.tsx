import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle, ActivityIndicator } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { api } from "app/services/api"
import { TxKeyPath } from "app/i18n"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>()

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()

  const [loginError, setLoginError] = useState<TxKeyPath>("common.empty");
  //const [error, setError] = useState<TxKeyPath>(""); // Set the type of error to TxKeyPath

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    // setAuthEmail("ignite@infinite.red")
    // setAuthPassword("ign1teIsAwes0m3")

    setAuthEmail("eve.holt@reqres.in")
    setAuthPassword("cityslicka")
  }, [])

  const error = isSubmitted ? validationError : ""

  async function login() {
    setIsSubmitted(true)
    setIsLoading(true)
    setAttemptsCount(attemptsCount + 1)

    // Clear the previous error message when attempting to login again
    setLoginError("common.empty")


    if (validationError) return

    // u: Make a request to your server to get an authentication token.
    const result = await api.login(authEmail, authPassword)

    if (result.kind === "ok") {
      // If the login is successful, reset the fields and set the token.
      setIsSubmitted(false)
      setAuthPassword("")
      setAuthEmail("")
      console.log(result)
      setAuthToken(result.authToken)
    } else {
      // Handle API errors or authentication failure here.
      switch (result.kind) {
        case "unauthorized":
          setLoginError("loginScreen.errors.invalidCredentials"); // Use the correct translation key
          break;
        case "server":
          setLoginError("loginScreen.errors.serverError"); // Use the correct translation key
          break;
        default:
          setLoginError("loginScreen.errors.unknownError"); // Use the correct translation key
          break;
      }
    }

    setIsLoading(false)

    //commenting demo code
    // // If successful, reset the fields and set the token.
    // setIsSubmitted(false)
    // setAuthPassword("")
    // setAuthEmail("")

    // We'll mock this with a fake token.
    //setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  useEffect(() => {
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])
  //      {loginError && <Text size="sm" weight="light" style={$hint} > {loginError} </Text> }
  //const { t } = useTranslation(); // Use the translation hook
  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    > 
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      {/* Display the error message above the email field */}
      {/*loginError !== "" && <Text style={$hint} tx={loginError} weight="light" />*/}
      {loginError !== "common.empty" && <Text style={$hint} tx={loginError} weight="light" />}

      {attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}
      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />
            {/* Show the loading icon during API call */}
      {isLoading && <ActivityIndicator color={colors.palette.primary500} size="large" style={$loadingIndicator} />}

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $loadingIndicator: ViewStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  //marginTop: -25, // Adjust the marginTop and marginLeft to center the spinner
  //marginLeft: -25, // Adjust the marginTop and marginLeft to center the spinner
};


// @demo remove-file
