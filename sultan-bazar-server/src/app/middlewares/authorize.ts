import auth from './auth';
import { ACCESS_POLICY, AccessAction } from '../policies/access';

const authorize = (action: AccessAction) => auth(...ACCESS_POLICY[action]);

export default authorize;
