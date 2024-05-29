import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import SignIn from "./screens/SignIn";
import Home from "./screens/Home";
import Loading from "./screens/Loading";
import CreateEvent from "./screens/CreateEvent";
import ViewEvents from "./screens/ViewEvents";
import EventDetails from "./screens/EventDetails"; // Importar la nueva pantalla
import ConfirmAttendance from "./screens/ConfirmAttendance";

import { useAuth } from './AuthContext';

export default function AuthNavigator() {
  const Stack = createNativeStackNavigator();

  const { loading, signout, user } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={CreateEvent}
              options={{
                title: "Crear Evento",
              }}
            />
            <Stack.Screen
              name="ViewEvents"
              component={ViewEvents}
              options={{
                title: "Eventos Creados",
              }}
            />
            <Stack.Screen
              name="EventDetails"
              component={EventDetails}
              options={{
                title: "Detalles del Evento",
              }}
            />
            <Stack.Screen
              name="ConfirmAttendance"
              component={ConfirmAttendance}
              options={{
                title: "Confirmar Asistencia",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
                animationTypeForReplace: signout ? "pop" : "push",
              }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}