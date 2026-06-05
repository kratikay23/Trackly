import { useNavigate } from "react-router-dom";
import SosAlertModal from "./SOSALertModel";

const SosAlertRoute = () => {
    const navigate = useNavigate();
    return <SosAlertModal onClose={() => navigate("/")} />;
};

export default SosAlertRoute;
