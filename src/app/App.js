import * as React from "react";
import Layout from "./components/Layout";
import Steps from "./pieces/Steps";

const App = React.memo(function App() {
  return (
    <Layout>
      <Steps />
    </Layout>
  );
});

export default App;
