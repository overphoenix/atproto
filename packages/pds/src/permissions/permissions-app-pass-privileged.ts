import { PermissionsAppPass } from './permissions-app-pass.js'

export class PermissionsAppPassPrivileged extends PermissionsAppPass {
  override allowsRpc() {
    return true
  }
}
