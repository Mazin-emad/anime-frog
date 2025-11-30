import "./App.css";
import { ThemeProvider } from "./components/global/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import { Toaster } from "./components/global/Toaster";
import MainRouter from "./routers/MainRouter";
import Layout from "./components/global/sidebar/Layout";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <Toaster />
        <AuthGuard>
          <Layout>
            <MainRouter />
          </Layout>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
