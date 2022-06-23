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
import { firebaseSetHeadCode, headQuery } from "../firebase/client/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

const mode = {
	HEAD: "head",
	LEG: "leg",
};

const App = React.memo(function App() {
	const [head] = useDocumentData(headQuery);

	const localCode = React.useRef(parseInt(Math.random() * 10e4));

	const [takoMode, settakoMode] = React.useState(null);

	const [user] = useAuthState(au);

	function handleTakoMode() {
		const { uid, passkey, type } = this;
		uid && passkey && firebaseAdminLogin({ uid: uid, passkey: passkey });

		if (type === mode.HEAD) {
			firebaseSetHeadCode({ code: localCode.current });
		}

		user && settakoMode(type);
	}

	React.useEffect(() => {
		if (head) {
			const { code } = head;
			if (code !== localCode.current) {
				settakoMode(null);
			}
		}
	}, [head]);

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
