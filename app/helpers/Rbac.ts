import { AccessControl } from 'accesscontrol'

const Rbac = new AccessControl()

Rbac.grant('user')
  .updateOwn('account')
  .readOwn('account')
  .grant('admin')
  .extend('user')
  .readAny('account')
  .updateAny('account')
  .deleteAny('account')

export default Rbac
