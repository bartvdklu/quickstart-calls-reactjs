import {useSbCalls} from "../../../lib/sendbird-calls";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {useEffect, useMemo} from "react";
import Header from "../../organisms/Header";
import Authenticator from "../../../containers/Authenticator";
import CallViewAdmin from "../../views/CallViewAdmin";
import DialViewAdmin from "../../views/DialViewAdmin";
import styled from "styled-components";
import {media} from "../../../utils";
import Screen from "../../templates/Screen/Screen";
import * as mixins from "../../../styles/mixins";
import Overlay from "../../atoms/Overlay";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  padding-bottom: 55px; // TabToolbar height
  ${media.main} {
    padding-bottom: 0;
  }
`;

const Contents = styled(Screen)`
  ${mixins.flexCenter};
  flex-direction: column;
  height: calc(100% - 80px - 57px);
  ${media.main} {
    height: calc(100% - 48px - 56px);
  }
`;

interface DirectCallMainAdminProps {
}
const DirectCallMainAdmin: React.FC<DirectCallMainAdminProps> = ({ children }) => {
    const { isAuthenticated, calls } = useSbCalls();
    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const { path, url } = useRouteMatch();

    useEffect(() => {
        if (location.pathname === `${url}/admin`) {
            if (isAuthenticated) {
                history.replace('/admin');
            }
        }
    }, [isAuthenticated, location.pathname]);

    const onCall = useMemo(() => {
        return calls.find(call => call.isOngoing)
    }, [calls])

    const header = location.pathname === `${url}/`
        ? null
        : [
            <Header key="header"/>,
            <Authenticator key="authenticator"/>,
        ];

    return (
        <Wrapper>
            {!!calls.length && <CallViewAdmin call={calls[calls.length - 1]}/>}
            {/* {header} */}
            <Contents>
                <DialViewAdmin />
                {onCall &&
                <Overlay>
                  <CallViewAdmin call={onCall} />
                </Overlay>
                }
            </Contents>
        </Wrapper>
    );
};

export default DirectCallMainAdmin;
