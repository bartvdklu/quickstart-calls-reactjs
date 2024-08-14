import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
// import DirectCallLanding from "./components/pages/DirectCallLanding";
import DirectCallFullScreenAdmin from "./components/pages/DirectCallFullScreenAdmin";

const DirectCallAppAdmin = () => {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}/full-screen`} component={DirectCallFullScreenAdmin} />
            <Redirect to={`${path}/full-screen`} />
            {/*<Route exact path={path} component={DirectCallLanding} />*/}
        </Switch>
    );
}

export default DirectCallAppAdmin;
