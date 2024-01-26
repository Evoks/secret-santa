import Title from "../../components/Title";
import Test1 from "./Test1";
import Test2 from "./Test2";

const TestPage: React.FC = ({ }) => {
	return <React.Fragment>
		<Title title="Test 1" />
		<Test1 />
		<hr className="my-8"/>
		<Title title="Test 2" />
		<Test2 />
	</React.Fragment>;
};

export default TestPage;

