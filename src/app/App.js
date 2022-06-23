import * as React from "react";
import { au } from "../firebase/creds/client";
import Layout from "./components/Layout";
import TakoModal from "./components/TakoModal";
import Recorder from "./pieces/Recorder";
import Steps from "./pieces/Steps";
import { RecordProvider } from "./state/data/RecordContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { SubjectProvider } from "./state/data/SubjectContext";
import { firebaseAdminLogin } from "../firebase/client/auth";

const mode = {
	HEAD: "head",
	LEG: "leg",
};

const App = React.memo(function App() {
	const [takoMode, settakoMode] = React.useState(null);

	const [user, loading, error] = useAuthState(au);

	function handleTakoMode() {
		const { uid, passkey, type } = this;
		uid && passkey && firebaseAdminLogin({ uid: uid, passkey: passkey });
		user && settakoMode(type);
	}

	const isHead = takoMode === mode.HEAD ? true : false;
	const isLeg = takoMode === mode.LEG ? true : false;

	return (
		<Layout>
			<TakoModal open={takoMode === null} {...{ handleTakoMode }} />
			<SubjectProvider>
				<RecordProvider>
					{isHead && <Steps admin={user} />}
					{isLeg && <Recorder admin={user} />}
				</RecordProvider>
			</SubjectProvider>
		</Layout>
	);
});

export default App;
