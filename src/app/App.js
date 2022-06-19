import * as React from "react";
import Layout from "./components/Layout";
import Recorder from "./pieces/Recorder";
import Steps from "./pieces/Steps";

import { Provider as SubjectProvider } from "./state/data/SubjectContext";

const App = React.memo(function App() {
	return (
		<Layout>
			<SubjectProvider>
				<Recorder />
			</SubjectProvider>
		</Layout>
	);
});

export default App;
