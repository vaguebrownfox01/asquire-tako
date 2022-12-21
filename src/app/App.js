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
import { getHeadCode } from "./utils/headcode";
import { MODE } from "./appconfig/info";

const App = React.memo(function App() {
	const [user] = useAuthState(au);
	const [head] = useDocumentData(headQuery);

	const localCode = React.useRef(getHeadCode());

	const [takoMode, settakoMode] = React.useState(null);

	function handleTakoMode() {
		const { uid, passkey, type } = this;
		uid && passkey && firebaseAdminLogin({ uid: uid, passkey: passkey });

		if (type === MODE.CONTROL) {
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

	const isControl = takoMode === MODE.CONTROL;
	const isRecord = takoMode === MODE.RECORD;

	return (
		<Layout>
			<TakoModal open={!takoMode} {...{ handleTakoMode }} />
			<SubjectProvider>
				<RecordProvider>
					{isControl && <Steps admin={user} />}
					{isRecord && <Recorder admin={user} />}
				</RecordProvider>
			</SubjectProvider>
		</Layout>
	);
});

export default App;
