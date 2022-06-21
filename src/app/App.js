import * as React from "react";
import Layout from "./components/Layout";
import TakoModal from "./components/TakoModal";
import Recorder from "./pieces/Recorder";
import Steps from "./pieces/Steps";
import { RecordProvider } from "./state/data/RecordContext";

import { SubjectProvider } from "./state/data/SubjectContext";

const mode = {
	HEAD: "head",
	LEG: "leg",
};

const App = React.memo(function App() {
	const [takoMode, settakoMode] = React.useState(null);

	function handleTakoMode() {
		settakoMode(this.type);
	}

	const isHead = takoMode === mode.HEAD ? true : false;
	const isLeg = takoMode === mode.LEG ? true : false;

	return (
		<Layout>
			<TakoModal open={takoMode === null} {...{ handleTakoMode }} />
			<SubjectProvider>
				<RecordProvider>
					{isHead && <Steps />}
					{isLeg && <Recorder />}
				</RecordProvider>
			</SubjectProvider>
		</Layout>
	);
});

export default App;
