import PrivateRoute from 'components/atoms/PrivateRoute';
import {
    Switch,
    useRouteMatch,
} from 'react-router-dom';
import DirectCallMainAdmin from "../DirectCallMainAdmin";


const DirectCallFullScreenAdmin = () => {
  const { path } = useRouteMatch();

  return (
      <Switch>
          <PrivateRoute exact path={path} component={DirectCallMainAdmin} />
      </Switch>
  );

};

export default DirectCallFullScreenAdmin;
